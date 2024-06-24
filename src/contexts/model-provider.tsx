"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { ManageMembersModal } from "@/components/modals/manage-members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
export function ModelProvider() {
	return (
		<>
			<CreateServerModal />
			<EditServerModal />
			<InviteModal />
			<ManageMembersModal />
			<CreateChannelModal />
		</>
	);
}
