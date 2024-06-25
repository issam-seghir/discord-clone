
import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
   try {
    const profile = await getCurrentProfile();
	if (!profile) {
		return new NextResponse("Unauthorized", { status: 401 });
	}
    const {searchParams} = new URL(req.url);

	const channelId = searchParams.get("channelId"); ;
    const cursor = searchParams.get("cursor");
	if(!channelId){
        return new NextResponse("Channel ID is required", { status: 400 });
    }
    let messages: Message[] = [];

    if(cursor){
        messages = await prisma.message.findMany({
            take: MESSAGE_BATCH,
            skip: 1,
            cursor: {
                id : cursor,
            },
            where: {
                channelId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }else {
        messages = await prisma.message.findMany({
            take: MESSAGE_BATCH,
            where: {
                channelId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    let nextCursor = null;

    if(messages.length === MESSAGE_BATCH){
        nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({
        items: messages,
        nextCursor,
    });
   } catch (error: any) {
		console.log(error, "MESSAGES API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
   }
}
