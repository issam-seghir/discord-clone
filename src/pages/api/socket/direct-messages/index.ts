import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/server";
import { getCurrentProfilePage } from "@/lib/query";
import { prisma } from "@/lib/prismadb";
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	try {
		const profile = await getCurrentProfilePage(req);
		const { fileUrl, content } = req.body;
		const { conversationId } = req.query;
		if (!profile) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (!conversationId) {
			return res.status(400).json({ message: "conversationId  is required" });
		}
		if (!content) {
			return res.status(400).json({ message: "Content  is required" });
		}

		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
			},
		});

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

		const member =
			conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
		if (!member) {
			return res.status(404).json({ message: "Member not found" });
		}

		const message = await prisma.directMessage.create({
			data: {
				content,
				fileUrl,
				memberId: member.id,
				conversationId: conversationId as string,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		const channelKey = `chat:${conversationId}:messages`;
		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(201).json(message);
	} catch (error) {
		console.error(error);
        console.log("DIRECT MESSAGES API ERROR");
		return res.status(500).json({ error: "Internal server error" });
	}
}
