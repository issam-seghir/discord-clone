"use client"
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { useStore } from "@/store/store";
import { Plus } from "lucide-react";

export function SideBarActions() {
	const onOpen = useStore.use.onOpen();
	return (
		<div>
			<ActionTooltip align="center" side="right" label="Add a server">
				<button onClick={() => onOpen("createServer")} className="group flex items-center">
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						<Plus size={25} className="group-hover:text-white transition text-emerald-500" />
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
}
