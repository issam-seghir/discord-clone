import { ChatHeader } from "@/components/chat/chat-header";
import { getCurrentMember, getCurrentProfile, getOrCreateConversation } from "@/lib/query";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
	params: {
		serverId: string;
		memberId: string;
	};
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return auth().redirectToSignIn();
	}
	const currentMember = await getCurrentMember(params.serverId, profile?.id);
	if (!currentMember) {
		return redirect("/");
	}
	const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
	if (!conversation) {
		return redirect(`/servers/${params.serverId}`);
	}
	const { memberOne, memberTwo } = conversation;
	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={otherMember.profile.name}
				serverId={params.serverId}
				type="conversation"
				imageUrl={otherMember.profile.imageUrl ?? undefined}
			/>
		</div>
	);
}
