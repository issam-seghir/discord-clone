import React from 'react'
import { Hash ,Menu} from 'lucide-react'
import { MobileToggle } from '@/components/mobile-toggle';

interface ChatHeaderProps {
    name: string;
    type: "conversation" | "channel";
    imageUrl?: string;
    serverId: string;
    }

export  function ChatHeader({ name, type, imageUrl, serverId }: ChatHeaderProps) {

  return (
		<div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 ">
			<MobileToggle serverId={serverId}/>
			{type === "channel" && <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2'/>}
            <p className="text-md font-semibold text-black dark:text-white">{name}</p>
		</div>
  );
}
