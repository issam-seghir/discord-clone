"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store/store";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { MemberRole } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, TrashIcon, UserPlus, Users } from "lucide-react";
import { useState } from "react";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

export function ServerHeader({ server, role }: ServerHeaderProps) {
	const onOpen = useStore.use.onOpen();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	const handleInviteClick = () => {
		setIsDropdownOpen(false);
		onOpen("invite", { server });
	};
	const handleServerSettingsClick = () => {
		setIsDropdownOpen(false);
		onOpen("editServer", { server });
	};

	function handleMangeMembersClick() {
		setIsDropdownOpen(false);
		onOpen("manageMembers", { server });
	}
	function handleLeaveServerClick() {
		setIsDropdownOpen(false);
		onOpen("leaveServer", { server });
	}
	function handleDeleteServerClick() {
		setIsDropdownOpen(false);
		onOpen("deleteServer", { server });
	}
	function handleCreateChannelClick() {
		setIsDropdownOpen(false);
		onOpen("createChannel", { server });
	}

	return (
		<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="w-5 h-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
				{isModerator && (
					<DropdownMenuItem
						onClick={handleInviteClick}
						className="text-indigo-600 dark:text-indigo-400 text-sm px-3 py-2 cursor-pointer"
					>
						Invite People
						<UserPlus className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem onClick={handleMangeMembersClick} className="text-sm px-3 py-2 cursor-pointer">
						Manage Members
						<Users className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem onClick={handleServerSettingsClick} className="text-sm px-3 py-2 cursor-pointer">
						Server Settings
						<Settings className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem
						onClick={handleCreateChannelClick}
						className="text-indigo-600 dark:text-indigo-400 text-sm px-3 py-2 cursor-pointer"
					>
						Create Channel
						<PlusCircle className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator />}
				{isAdmin && (
					<DropdownMenuItem
						onClick={handleDeleteServerClick}
						className="text-rose-500 text-sm px-3 py-2 cursor-pointer"
					>
						Delete Server
						<TrashIcon className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						onClick={handleLeaveServerClick}
						className="text-rose-500 text-sm px-3 py-2 cursor-pointer"
					>
						Leave Server
						<LogOut className="w-4 h-4 ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
