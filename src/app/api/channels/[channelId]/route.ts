import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function DELETE(req: Request,{params}: {params: {channelId: string}}) {
	try {
		const profile = await getCurrentProfile();
		const { searchParams } = new URL(req.url);
		const { name, type } = await req.json();
		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!serverId) {
			return new NextResponse("Server not found", { status: 404 });
		}
		if(!params.channelId){
            return new NextResponse("Channel not found", { status: 404 });
        }

		const server = await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						id: params.channelId,
						name : {
                            not: "general"
                        },
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error: any) {
		console.log(error, "CHANNEL ID DELETE API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
