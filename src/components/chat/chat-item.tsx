"use client";

import { ActionTooltip } from "@/components/ui/action-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import axios from "axios";
import { Edit, FileText, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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

const formSchema = z.object({
	content: z.string().min(1),
});

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
	const onOpen = useStore.use.onOpen();
	const router = useRouter();
	const params = useParams();

	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
	const canEditMessage = !deleted && isOwner && !fileUrl;
	const isPDF = fileUrl?.endsWith(".pdf") && fileUrl;
	const isImage = fileUrl && !isPDF;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: content,
		},
	});

	useEffect(() => {
		form.reset({
			content: content,
		});
	}, [content, form]);

	useEffect(() => {
		const handleKeyDown = (event: any) => {
			if (event.key === "Escape" || event.keyCode === 27) {
				setIsEditing(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery,
			});
			await axios.patch(url, values);
			form.reset();
			setIsEditing(false);
			// router.refresh();
		} catch (error) {
			console.error(error);
		}
	};

	const onMemberClick = () => {
		if(member?.id === currentMember.id) return;
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	}

	return (
		<div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div onClick={onMemberClick} className="transition cursor-pointer hover:drop-shadow-md">
					<UserAvatar src={member.profile.imageUrl ?? undefined} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
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
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex items-center w-full gap-x-2 pt-2"
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<div className="relative w-full">
													<Input
														disabled={isLoading}
														className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
														placeholder="Edited Message"
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button disabled={isLoading} size="sm" variant="primary">
									Save
								</Button>
							</form>
							<span className="mt-1 text-[10px] text-zinc-400">
								Press escape to cancel , enter to save
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit
								onClick={() => setIsEditing(true)}
								className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label="Delete">
						<Trash
							onClick={() =>
								onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })
							}
							className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
		</div>
	);
}
