import React from "react";

import { getCurrentProfile, getProfileServers } from "@/lib/query";
import { redirect } from "next/navigation";
import { SideBarActions } from "@/components/layout/side-bar-actions";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SideBarItem } from "@/components/layout/side-bar-item";
import { ModeToggle } from "@/components/mode-toggler";
import { UserButton } from "@clerk/nextjs";


export  async function SideBar() {
	const profile = await getCurrentProfile();
	if (!profile) {
		return redirect("/");
	}

const servers = await getProfileServers(profile.id);

	return (
		<div className="flex flex-col space-y-4 items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
			<SideBarActions />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers?.map((server) => (
					<div key={server.id} className="mb-4">
						<SideBarItem name={server.name} id={server.id} imageUrl={server.imageUrl} />
					</div>
				))}
			</ScrollArea>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton
					afterSignOutUrl="/"
					appearance={{
						elements: {
							avatarBox: "h-[48px] w-[48px]",
						},
					}}
				/>
			</div>
		</div>
	);
}
