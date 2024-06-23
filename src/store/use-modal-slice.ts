import { ModalSlice, SliceCreator } from "@/types/store";

export const createUserModelSlice: SliceCreator<ModalSlice> = (set) => ({
	type: null,
	isOpen: false,
	data: {},
	onOpen: (type,data) =>
		set((state) => {
			state.isOpen = true;
			state.type = type;
			if(data) state.data = data;
		}),
	onClose: () => set({ type: null, isOpen: false }),
});
