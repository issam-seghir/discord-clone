"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/store";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { UserAvatar } from "@/components/user/user-avatar";
import { DropdownMenu,DropdownMenuItem, DropdownMenuPortal,DropdownMenuSeparator,DropdownMenuContent,DropdownMenuSubContent,DropdownMenuSub,DropdownMenuSubTrigger,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { ShieldCheck ,ShieldAlert ,MoreVertical ,ShieldQuestion, Shield, Check, Gavel, Loader2} from "lucide-react";
import qs from "query-string";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export function ManageMembersModal() {
	const router = useRouter();
	const [loadingId, setLoadingId] = useState("");
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onOpen = useStore.use.onOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data() as { server: ServerWithMembersWithProfiles };
	const isModelOpen = isOpen && type === "manageMembers";
const roleIconMap = {
	[MemberRole.ADMIN]: <ShieldAlert className="w-4 text-rose-500 h-4 ml-2" />,
	[MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 " />,
	[MemberRole.GUEST]: null,
};

const onRoleChange = async(memberId : string , role : MemberRole) => {
	try {
		setLoadingId(memberId)
		const url = qs.stringifyUrl({
			url: `/api/members/${memberId}`,
			query: {
				serverId: data.server.id,
				memberId,
			 },
		});
		const res = await axios.patch(url, { role });
		router.refresh();
		onOpen("manageMembers", { server: res.data });
	} catch (error) {
		console.log(error);

	}finally{
		setLoadingId("")
	}
}

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent aria-describedby={undefined} className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
					<DialogDescription className="text-center text-sm text-zinc-500 dark:text-neutral-400 px-6 py-2">
						{data?.server?.members?.length} members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{data?.server?.members?.map((member) => (
						<div key={member.id} className="flex items-center  gap-x-2 mb-6">
							<UserAvatar src={member?.profile?.imageUrl ?? undefined} />
							<div className="flex flex-col gap-y-1">
								<div className="text-sm font-semibold  gap-x-1 flex items-center">
									{member.profile?.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{data?.server?.profileId !== member.profileId && loadingId !== member.id && (
								<div className="ml-auto">
									<DropdownMenu >
										<DropdownMenuTrigger asChild>
											<MoreVertical className="w-4 h-4 text-zinc-500" />
										</DropdownMenuTrigger>

										<DropdownMenuContent side="left">
											<DropdownMenuSub >
												<DropdownMenuSubTrigger className="flex items-center">
													<ShieldQuestion className="w-4 h-4 mr-2" />
													<span>Role</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal >
													<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() => onRoleChange(member.id, "GUEST")}
															>
																<Shield className="mr-2 h-4 w-4" />
																Guest
																{member.role === MemberRole.GUEST && (
																	<Check className="w-4 h-4 ml-auto" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => onRoleChange(member.id, "MODERATOR")}
															>
																<ShieldCheck className="mr-2 h-4 w-4" />
																Moderator
																{member.role === MemberRole.MODERATOR && (
																	<Check className="w-4 h-4 ml-auto" />
																)}
															</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => {
													setLoadingId(member.id);
													setTimeout(() => {
														setLoadingId("");
													}, 1000);
												}}
											>
												<Gavel className="mr-2 h-4 w-4" />
												Kick
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
