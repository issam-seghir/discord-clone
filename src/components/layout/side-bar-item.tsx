"use client"
import React from 'react'
import Image from 'next/image'
import { useParams,useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionTooltip } from '@/components/ui/action-tooltip'

interface SideBarItemProps {
    name: string;
    id: string;
    imageUrl: string | null;
    }

export  function SideBarItem({ name, id, imageUrl }: SideBarItemProps) {
    const router = useRouter();
    const params = useParams();
  return (
		<ActionTooltip side="right" align="center" label={name}>
			<button
				onClick={() => {
					router.push(`/servers/${id}`);
				}}
				className={cn(
					" relative group flex items-center",
				)}
			>
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
						params?.serverId !== id && "group-hover:h-[20px]",
						params?.serverId === id ? "h-[36px]" : "h-[8px]"
					)}
				/>
				<div
					className={cn(
						"relative group flex mx-3 h-[48px]  w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
						params?.serverId === id && "rounded-[16px] text-primary bg-primary/10",
					)}
				>
                    {imageUrl &&
                        <Image
                            fill
                            src={imageUrl}
                            alt={name}
                            objectFit="cover"
                        />
                    }
                </div>
			</button>
		</ActionTooltip>
  );
}
