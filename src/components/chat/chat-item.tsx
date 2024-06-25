import { ActionTooltip } from "@/components/ui/action-tooltip";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileText, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface ChatItemProps {
	id: string;
	content: string;
	member: Member & { profile: Profile };
	timestamp: string;
	fileUrl: string | null;
	deleted: boolean;
	currentMember: Member;
	isUpdated: boolean;
	socketUrl: string;
	socketQuery: Record<string, string>;
}

const roleIconMap = {
	GUEST: null,
	ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
	MODERATOR: <ShieldCheck className="w-4 ml-2 h-4 text-indigo-500" />,
};

export function ChatItem({
	id,
	content,
	member,
	timestamp,
	fileUrl,
	deleted,
	currentMember,
	isUpdated,
	socketUrl,
	socketQuery,
}: ChatItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
	const canEditMessage = !deleted && isOwner && !fileUrl;
	const isPDF = fileUrl?.endsWith(".pdf") && fileUrl;
	const isImage = fileUrl && !isPDF;
	return (
		<div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div className="transition cursor-pointer hover:drop-shadow-md">
					<UserAvatar src={member.profile.imageUrl ?? undefined} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p className="font-semibold text-sm hover:underline cursor-pointer">
								{member.profile.name}
							</p>
							<ActionTooltip label={member.role}>{roleIconMap[member.role]}</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noreferrer noopener"
							className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
						>
							<Image src={fileUrl} alt={content} fill className="object-cover" />
						</a>
					)}
					{isPDF && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noreferrer noopener"
							className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
						>
							<FileText className="w-12 h-12 text-zinc-500 dark:text-zinc-400 m-auto" />
						</a>
					)}
					{!fileUrl && !isEditing && (
						<p
							className={cn(
								"text-sm text-zinc-600 dark:text-zinc-300",
								deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
							)}
						>
							{content}
							{isUpdated && !deleted && (
								<span className="text-[10px] text-zinc-500 dark:text-zinc-400 ">(edited)</span>
							)}
						</p>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
						</ActionTooltip>
					)}
					<ActionTooltip label="Delete">
						<Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
					</ActionTooltip>
				</div>
			)}
		</div>
	);
}
