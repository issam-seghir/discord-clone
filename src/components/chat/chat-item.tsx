import { ActionTooltip } from "@/components/ui/action-tooltip";
import { UserAvatar } from "@/components/user/user-avatar";
import { Member, MemberRole, Profile } from "@prisma/client";
import { ShieldAlert,ShieldCheck, FileText } from "lucide-react"
import Image from "next/image";
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
					{/* <p className="text-sm mt-2">{content}</p> */}
				</div>
			</div>
		</div>
	);
}
