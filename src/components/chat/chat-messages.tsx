"use client";

import { ChatItem } from "@/components/chat/chat-item";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessagesWithMemberWithProfile } from "@/types/server";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { Fragment } from "react";
import { format } from "date-fns";

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
		</div>
	);
}
