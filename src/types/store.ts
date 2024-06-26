import { Channel, ChannelType, Server } from "@prisma/client";
import { StateCreator } from "zustand";

export type ModalType =
	| "createServer"
	| "invite"
	| "editServer"
	| "manageMembers"
	| "leaveServer"
	| "deleteServer"
	| "createChannel"
	| "editChannel"
	| "deleteChannel"
	| "messageFile"
	| "deleteMessage";

export interface ModelData {
	server?: Server;
	channel?: Channel;
	channelType?: ChannelType;
	apiUrl?: string;
	query?: Record<string, any>;
}
export interface ModalSlice {
	type: ModalType | null;
	data: ModelData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModelData) => void;
	onClose: () => void;
}

export type SliceCreator<S> = StateCreator<S, [["zustand/immer", never], ["zustand/devtools", never]], [], S>;
export type Store = ModalSlice;
