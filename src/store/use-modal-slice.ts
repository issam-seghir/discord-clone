import { StateCreator } from "zustand";

import { ModalSlice } from "@/types/store";

export type SliceCreator<S> = StateCreator<S, [["zustand/immer", never], ["zustand/devtools", never]], [], S>;

export const createUserModelSlice: SliceCreator<ModalSlice> = (set) => ({
	type: null,
	isOpen: false,
	setType: (type) => set({ type }),
	onOpen: (type) =>
		set((state) => {
			state.isOpen = true;
			state.type = type;
		}),
	onClose: () => set({ type: null, isOpen: false }),
});
