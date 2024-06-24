"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { ManageMembersModal } from "@/components/modals/manage-members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";


export function ModalProvider() {
	return (
		<>
			<CreateServerModal />
			<EditServerModal />
			<InviteModal />
			<ManageMembersModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<EditChannelModal />
		</>
	);
}
