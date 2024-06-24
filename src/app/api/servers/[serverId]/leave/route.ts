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

		// leave server logic
        const server = await prisma.server.update({
            where: {
                id: params.serverId,
                profileId: { // the owner of the server (admin) can't leave the server
                    not: profile.id,
                },
                members: { // the user must be a member of the server
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });

		return NextResponse.json(server);
	} catch (error: any) {
		console.log(error, "SERVER ID -- LEAVE SERVER API ERROR");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
