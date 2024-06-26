import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getChannel, getCurrentProfile, getMember } from "@/lib/query";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return auth().redirectToSignIn();
	}
	const channel = await getChannel(params.channelId);
	const member = await getMember(params.serverId, profile.id);

	if (!channel || !member) {
		return redirect("/");
	}
	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={channel?.name} serverId={channel?.serverId} type="channel" />
			{channel.type === ChannelType.TEXT && (
				<ChatMessages
					chatId={channel.id}
					member={member}
					name={channel.name}
					type="channel"
					apiUrl="/api/messages"
					socketUrl="/api/socket/messages"
					socketQuery={{
						channelId: channel.id,
						serverId: channel.serverId,
					}}
					paramKey="channelId"
					paramValue={channel.id}
				/>
			)}
			{channel.type === ChannelType.AUDIO && <MediaRoom chatId={channel.id} video={false} audio={true} />}
			{/* {channel.type === ChannelType.VIDEO && <MediaRoom chatId={channel.id} video={true} audio={true} />} */}
			<ChatInput
				name={channel.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
			/>
		</div>
	);
}
