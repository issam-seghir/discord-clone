import React from "react";

import { getCurrentProfile, getProfileServers } from "@/lib/query";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismadb";


export default async function SideBar() {
	const profile = await getCurrentProfile();
	if (!profile) {
		return redirect("/");
	}

const servers = await getProfileServers(profile.id);

	return (
		<div className="flex flex-col space-y-4 items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
			<div className="flex items-center justify-center h-16 border-b border-gray-700">
				<h1 className="text-white">Servers</h1>
			</div>
			<div className="flex flex-col items-center justify-center">
				{servers?.map((server) => (
					<div key={server.id} className="flex items-center justify-center w-16 h-16 border border-gray-700 rounded-full">
						<h1 className="text-white">{server.name}</h1>
					</div>
				))}
			</div>
		</div>
	);
}
