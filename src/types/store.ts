
import { Server } from "@prisma/client";
import { StateCreator } from "zustand";


export type ModalType = "createServer" | "invite" | "editServer" | "manageMembers";


export interface ModelData {
	server?: Server;
}
export interface ModalSlice {
	type: ModalType | null;
	data: ModelData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModelData) => void;
	onClose: () => void;
}

export type SliceCreator<S> = StateCreator<S, [["zustand/immer", never], ["zustand/devtools", never]], [], S>;
export type Store = ModalSlice ;
