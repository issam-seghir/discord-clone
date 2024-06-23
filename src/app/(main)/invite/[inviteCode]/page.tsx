import { prisma } from "@/lib/prismadb";
import { getCurrentProfile, getServerByInviteCode } from "@/lib/query";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InviteCodePage({ params }: { params: { inviteCode: string } }) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return auth().redirectToSignIn();
	}
	if (!params.inviteCode) {
		return redirect("/");
	}
	const existingServer = await getServerByInviteCode(params.inviteCode, profile.id);

	if (existingServer) {
		return redirect(`/servers/${existingServer.id}`);
	}

	const server = await prisma.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}
	return <div>page</div>;
}
