"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";

export function ModelProvider() {
	return (
		<>
			<CreateServerModal />
			<InviteModal />
		</>
	);
}
