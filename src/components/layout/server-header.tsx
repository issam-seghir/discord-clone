import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { MemberRole } from "@prisma/client";
import { ChevronDown, Settings, UserPlus } from "lucide-react";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

export function ServerHeader({ server, role }: ServerHeaderProps) {
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = role === MemberRole.MODERATOR;
    console.log(role);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="w-5 h-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
					{isAdmin && (
						<DropdownMenuItem className="text-sm px-3 py-2 cursor-pointer">
							Server Settings
							<Settings className="w-4 h-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{isModerator && (
						<DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 text-sm px-3 py-2 cursor-pointer">
							Invite People
							<UserPlus className="w-4 h-4 ml-auto" />
						</DropdownMenuItem>
					)}
					<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
						Leave Server
					</button>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
