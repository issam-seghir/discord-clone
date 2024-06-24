import React from "react";

import { getCurrentProfile, getServer } from "@/lib/query";
import { redirect } from "next/navigation";
import { SideBarActions } from "@/components/layout/side-bar-actions";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SideBarItem } from "@/components/layout/side-bar-item";
import { ModeToggle } from "@/components/mode-toggler";
import { UserButton } from "@clerk/nextjs";
import { ChannelType,MemberRole } from "@prisma/client";
import { ServerHeader } from "@/components/layout/server-header";
import { ServerSearch } from "@/components/server-search";
import { Hash,Mic,Video,ShieldCheck,ShieldAlert } from "lucide-react";
interface ServerSideBarProps {
    serverId: string;
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>,
	[ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>,
	[ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.ADMIN]: <ShieldAlert className="text-rose-500 mr-2 h-4 w-4" />,
	[MemberRole.MODERATOR]: <ShieldCheck className="text-indigo-500 mr-2 h-4 w-4" />,
};

export async function ServerSideBar({ serverId }: ServerSideBarProps) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return redirect("/");
	}

	const server = await getServer(serverId,profile.id);

    const textChannels =  server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels =  server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels =  server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if(!server) {
        return redirect("/");
    }

    const role = server?.members?.find((member) => member.profileId === profile.id)?.role;
	return (
		<div className="flex flex-col space-y-4 items-center h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] py-3">
			<ServerHeader server={server} role={role} />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2"></div>
				<ServerSearch
					data={[
						{
							label: "Text Channels",
							type: "channel",
							data: textChannels?.map((channel) => ({
								icon: iconMap[channel.type],
								id: channel.id,
								name: channel.name,
							})),
						},
						{
							label: "Voice Channels",
							type: "channel",
							data: audioChannels?.map((channel) => ({
								icon: iconMap[channel.type],
								id: channel.id,
								name: channel.name,
							})),
						},
						{
							label: "Video Channels",
							type: "channel",
							data: videoChannels?.map((channel) => ({
								icon: iconMap[channel.type],
								id: channel.id,
								name: channel.name,
							})),
						},
						{
							label: "Members",
							type: "member",
							data: members?.map((member) => ({
								icon: roleIconMap[member.role],
								id: member.id,
								name: member.profile.name,
							})),
						},
					]}
				/>
			</ScrollArea>
		</div>
	);
}
