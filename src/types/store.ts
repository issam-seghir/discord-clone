
export type ModalType = "createServer";

export interface ModalSlice {
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType) => void;
	setType: (type: ModalType) => void;
	onClose: () => void;
}

export type Store = ModalSlice ;
