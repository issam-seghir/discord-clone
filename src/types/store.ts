import { ChannelType, Server } from "@prisma/client";
import { StateCreator } from "zustand";

export type ModalType =
	| "createServer"
	| "invite"
	| "editServer"
	| "manageMembers"
	| "leaveServer"
	| "deleteServer"
	| "createChannel";

export interface ModelData {
	server?: Server;
	channelType?: ChannelType;
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
