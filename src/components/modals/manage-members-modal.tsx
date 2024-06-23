"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/store";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { UserAvatar } from "@/components/user/user-avatar";

export function ManageMembersModal() {
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onOpen = useStore.use.onOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data() as { server: ServerWithMembersWithProfiles };
	const isModelOpen = isOpen && type === "manageMembers";

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
						<div key={member.id} className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
							<UserAvatar src={member?.profile?.imageUrl ?? undefined} />
							<div className="flex flex-col gap-y-1">
								<div className="text-sm font-semibold flex items-center">
									{member.profile?.name}
								</div>
							</div>
							{/* <div className="flex items-center space-x-4">
								<div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
								<div>
									<p className="text-lg font-semibold">{member.profile?.name}</p>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">{member.role}</p>
								</div>
							</div>
							<button className="text-red-600 dark:text-red-400 font-semibold">Remove</button> */}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
