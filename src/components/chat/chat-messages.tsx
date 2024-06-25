"use client";

import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessagesWithMemberWithProfile } from "@/types/server";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

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
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({
        apiUrl,
        paramKey,
        paramValue,
        queryKey: `chat:${chatId}`
    });
    console.log(status);

    if (status === "pending") {
        return (
            <div className="flex-1 justify-center flex flex-col items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-none my-4"/>
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
		<div className="flex-1 justify-end flex flex-col py-4 overflow-y-auto">
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse mt-auto ">
				{data?.pages?.map((group, index) => (
					<Fragment key={index}>
						{group.items.map((message: MessagesWithMemberWithProfile) => (
							<div key={message.id} className="flex items-end space-x-2">
								<div className="flex-shrink-0">
									<img
										src={message.member.profile.avatar}
										alt={message.member.profile.displayName}
										className="h-8 w-8 rounded-full"
									/>
								</div>
								<div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg">
									<p className="text-sm dark:text-zinc-400">{message.content}</p>
								</div>
							</div>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
}
