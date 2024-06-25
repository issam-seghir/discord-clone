import React from 'react'
import { Hash ,Menu} from 'lucide-react'
import { MobileToggle } from '@/components/mobile-toggle';
import { UserAvatar } from '@/components/user/user-avatar';
import { SocketIndicator } from "@/components/socket-indicator";

interface ChatHeaderProps {
    name: string;
    type: "conversation" | "channel";
    imageUrl?: string;
    serverId: string;
    }

export  function ChatHeader({ name, type, imageUrl, serverId }: ChatHeaderProps) {

  return (
		<div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 ">
			<MobileToggle serverId={serverId} />
			{type === "channel" && <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />}
			{type === "conversation" && <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />}
			<p className="text-md mr-6 font-semibold text-black dark:text-white">{name}</p>
			<SocketIndicator />
		</div>
  );
}
