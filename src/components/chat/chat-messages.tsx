"use client";

import { ChatItem } from "@/components/chat/chat-item";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { MessagesWithMemberWithProfile } from "@/types/server";
import { Member } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

export function ChatMessages({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}: ChatMessagesProps) {
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}/messages`;
	const updateKey = `chat:${chatId}/messages:update`;
	const chatRef = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
		apiUrl,
		paramKey,
		paramValue,
		queryKey: `chat:${chatId}`,
	});

	const latestMessageId = data?.pages?.[0]?.items?.[data?.pages?.[0]?.items?.length - 1]?.id;

	useChatSocket({ queryKey, addKey, updateKey });

	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		latestMessageId: latestMessageId,
	});


	if (status === "pending") {
		return (
			<div className="flex-1 justify-center flex flex-col items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs dark:text-zinc-400 text-zinc-500">Loading messages...</p>
			</div>
		);
	}
	if (status === "error") {
		return (
			<div className="flex-1 justify-center flex flex-col items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500  my-4" />
				<p className="text-xs dark:text-zinc-400 text-zinc-500">Failed to load messages.</p>
			</div>
		);
	}
	return (
		<div ref={chatRef} className="flex-1  flex flex-col py-4 overflow-y-auto">
			{!hasNextPage && <div className="flex-1" />}
			{!hasNextPage && <ChatWelcome type={type} name={name} />}
			{hasNextPage && (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
						>
							Load previous messages
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col-reverse mt-auto ">
				{data?.pages?.map((group, index) => (
					<Fragment key={index}>
						{group.items.map((message: MessagesWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								id={message.id}
								currentMember={member}
								member={message.member}
								isUpdated={message.updatedAt !== message.createdAt}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef}></div>
		</div>
	);
}
