import { prisma } from "@/lib/prismadb";
import { getCurrentProfile } from "@/lib/query";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const profile = await getCurrentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!params.serverId) {
			return new NextResponse("Server not found", { status: 404 });
		}
        const { name, imageUrl } = await req.json();

		const server = await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidv4(),
                name,
                imageUrl,
			},
		});

		return NextResponse.json(server);
	} catch (error: any) {
		console.log(error, "SERVER ID API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
