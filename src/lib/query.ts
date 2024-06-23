import { prisma } from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export async function initProfile() {
	noStore();
	const user = await currentUser();

	if (!user) return auth().redirectToSignIn();

	const profile = await prisma.profile.findUnique({
		where: {
			userId: user.id,
		},
	});
	if (profile) return profile;

	const name =
		user?.fullName ||
		user?.firstName ||
		user?.lastName ||
		user.primaryEmailAddress?.emailAddress.split("@")[0] ||
		"unknown";

	const newProfile = await prisma.profile.create({
		data: {
			userId: user.id,
			email: user.primaryEmailAddress?.emailAddress as string,
			name: name,
			imageUrl: user?.imageUrl,
		},
	});

	return newProfile;
}

export async function getCurrentProfile() {
	const user = await currentUser();
	if (!user) return auth().redirectToSignIn();

	const profile = await prisma.profile.findUnique({
		where: {
			userId: user.id,
		},
	});
	if (profile) return profile;
}

export async function getServer(id: string, profileId: string) {
	const server = await prisma.server.findUnique({
		where: {
			id,
			members: {
				some: {
					profileId,
				},
			},
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	});
	if (server) return server;
}

export async function getAllServers(id: string) {
	const servers = await prisma.server.findMany({
		where: {
			members: {
				some: {
					profileId: id,
				},
			},
		},
	});
	if (servers) return servers;
}

export async function getFirstServer(id: string) {
	const server = await prisma.server.findFirst({
		where: {
			members: {
				some: {
					profileId: id,
				},
			},
		},
	});
	if (server) return redirect(`/servers/${server.id}`);
}

export async function getServerByInviteCode(inviteCode: string, profileId: string) {
	const server = await prisma.server.findFirst({
		where: {
			inviteCode,
			members: {
				some: {
					profileId,
				},
			},
		},
	});
	return server;
}
