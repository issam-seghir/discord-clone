
import { StateCreator } from "zustand";


export type ModalType = "createServer";

export interface ModalSlice {
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType) => void;
	setType: (type: ModalType) => void;
	onClose: () => void;
}

export type SliceCreator<S> = StateCreator<S, [["zustand/immer", never], ["zustand/devtools", never]], [], S>;
export type Store = ModalSlice ;
