import React from "react";

import { getCurrentProfile, getServer } from "@/lib/query";
import { redirect } from "next/navigation";
import { SideBarActions } from "@/components/layout/side-bar-actions";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SideBarItem } from "@/components/layout/side-bar-item";
import { ModeToggle } from "@/components/mode-toggler";
import { UserButton } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { ServerHeader } from "@/components/layout/server-header";

interface ServerSideBarProps {
    serverId: string;
}
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
			<ServerHeader server={server} role={role}/>
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{/* {servers?.map((server) => (
					<div key={server.id} className="mb-4">
						<SideBarItem name={server.name} id={server.id} imageUrl={server.imageUrl} />
					</div>
				))} */}
			</ScrollArea>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">

			</div>
		</div>
	);
}
