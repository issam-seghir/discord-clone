import { ModalSlice, SliceCreator } from "@/types/store";

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
