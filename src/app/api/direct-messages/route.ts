import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { DirectMessage, Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
	try {
		const profile = await getCurrentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const { searchParams } = new URL(req.url);

		const conversationId = searchParams.get("conversationId");
		const cursor = searchParams.get("cursor");
		if (!conversationId) {
			return new NextResponse("conversation ID is required", { status: 400 });
		}
		let messages: DirectMessage[] = [];

		if (cursor) {
			messages = await prisma.directMessage.findMany({
				take: MESSAGE_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
			messages = await prisma.directMessage.findMany({
				take: MESSAGE_BATCH,
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}

		let nextCursor = null;

		if (messages.length === MESSAGE_BATCH) {
			nextCursor = messages[messages.length - 1].id;
		}

		return NextResponse.json({
			items: messages,
			nextCursor,
		});
	} catch (error: any) {
		console.log(error, "DIRECT MESSAGES API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
