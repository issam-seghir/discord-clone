import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { getCurrentMember, getCurrentProfile, getOrCreateConversation } from "@/lib/query";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MediaRoom } from "@/components/media-room";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Discord Clone | Conversation",
	description: "Conversation between members",
	openGraph: {
		type: "website",
	},
};


interface MemberIdPageProps {
	params: {
		serverId: string;
		memberId: string;
	};
	searchParams: {
		video?: boolean;
	};
}

export default async function MemberIdPage({ params, searchParams }: MemberIdPageProps) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return auth().redirectToSignIn();
	}

	const currentMember = await getCurrentMember(params?.serverId, profile?.id);
	if (!currentMember) {
		return redirect("/");
	}
	const conversation = await getOrCreateConversation(currentMember?.id, params?.memberId);
	if (!conversation) {
		return redirect(`/servers/${params.serverId}`);
	}
	const { memberOne, memberTwo } = conversation;
	const otherMember = memberOne.profileId === profile?.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={otherMember.profile.name}
				serverId={params?.serverId}
				type="conversation"
				imageUrl={otherMember.profile.imageUrl ?? undefined}
			/>
			{searchParams?.video && (
				<MediaRoom serverId={params?.serverId} chatId={conversation.id} video={true} audio={true} />
			)}
			{!searchParams?.video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type="conversation"
						apiUrl="/api/direct-messages"
						paramKey="conversationId"
						paramValue={conversation.id}
						socketUrl="/api/socket/direct-messages"
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>
					<ChatInput
						name={otherMember.profile.name}
						type="conversation"
						apiUrl="/api/socket/direct-messages"
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	);
}
