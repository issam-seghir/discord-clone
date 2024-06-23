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

export async function getServerMembers(id: string) {
	const members = await prisma.member.findMany({
		where: {
			serverId: id,
		},
	});
	if (members) return members;
}

export async function getServerChannels(id: string) {
	const channels = await prisma.channel.findMany({
		where: {
			serverId: id,
		},
	});
	if (channels) return channels;
}

export async function getChannelMessages(id: string) {
	const messages = await prisma.message.findMany({
		where: {
			channelId: id,
		},
	});
	if (messages) return messages;
}

export async function getChannel(id: string) {
	const channel = await prisma.channel.findUnique({
		where: {
			id,
		},
	});
	if (channel) return channel;
}

export async function getProfile(id: string) {
	const profile = await prisma.profile.findUnique({
		where: {
			id,
		},
	});
	if (profile) return profile;
}

export async function getProfileServers(id: string) {
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
