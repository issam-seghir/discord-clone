import qs from "query-string";

import { useSocket } from "@/contexts/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface UseChatQueryProps {
	queryKey: string;
	apiUrl: string;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
}

export function useChatQuery({ apiUrl, paramKey, paramValue, queryKey }: UseChatQueryProps) {
	const { isConnected } = useSocket();

	const fetchMessages = async ({ pageParam = undefined }) => {
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					[paramKey]: paramValue,
					cursor: pageParam,
				},
			},
			{ skipNull: true }
		);
		const res = await fetch(url);
		return res.json();
	};
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		initialPageParam: undefined,
		queryKey: [queryKey],
		queryFn: fetchMessages,
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchInterval: isConnected ? 1000 : false,
	});

	return {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	};
}
