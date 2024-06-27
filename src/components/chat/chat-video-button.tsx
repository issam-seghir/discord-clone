"use client";

import { ActionTooltip } from "@/components/ui/action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export function ChatVideoButton() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const isVideo = searchParams?.get("video");
	const Icon = isVideo ? VideoOff : Video;
	const tooltipLabel = isVideo ? "End video call" : "Start video call";

	const onClick = () => {
		const url = qs.stringify(
			{
				url: pathname || "",
				query: {
					video: !isVideo,
				},
			},
			{ skipNull: true }
		);
        router.push(url);

	};
	return (
		<ActionTooltip side="bottom" label={tooltipLabel}>
			<button onClick={onClick} className="hover:opacity-75 transition mr-4">
				<Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
			</button>
		</ActionTooltip>
	);
}
