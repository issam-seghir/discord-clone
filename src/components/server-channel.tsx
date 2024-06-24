"use client"
import { ActionTooltip } from '@/components/ui/action-tooltip';
import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Mic, Trash, Video ,Lock} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useStore } from "@/store/store";
import { ModalType } from '@/types/store';

interface ServerChannelParams {
    channel : Channel;
    server : Server,
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
};

export  function ServerChannel({channel,server,role}:ServerChannelParams) {
	const onOpen = useStore.use.onOpen();

    const router = useRouter();
    const params = useParams();

    const Icon = iconMap[channel.type];
    const onClick = () => {
		router.push(`servers/${params?.serverId}/channels/${channel.id}`);
	};
    const onAction = (e:React.MouseEvent, action:ModalType) => {
        e.stopPropagation();
        onOpen(action,{server,channel});
    }

  return (
		<button
			onClick={onClick}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.channelId === channel.id && "bg-zinc-700/10 dark:bg-zinc-700"
			)}
		>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			<p
				className={cn(
					"line-clamp-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
					params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
				)}
			>
				{channel.name}
			</p>
			{channel.name !== "general" && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit
							onClick={(e) => onAction(e, "editChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
					<ActionTooltip label="Delete">
						<Trash
							onClick={(e) => onAction(e, "deleteChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
		</button>
  );
}
