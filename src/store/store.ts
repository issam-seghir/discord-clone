import { createUserModelSlice } from "@/store/use-modal-slice";
import { Store } from "@/types/store";
import { createSelectorFunctions, ZustandFuncSelectors } from "auto-zustand-selectors-hook";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useStoreBase = create<Store>()(
	devtools(
		persist(
			subscribeWithSelector(
				immer((...a) => ({
					...createUserModelSlice(...a),
				}))
			),
			{
				name: "local-storage",
			}
		)
	)
);

export const useStore = createSelectorFunctions(useStoreBase) as typeof useStoreBase & ZustandFuncSelectors<Store>;

if (process.env.NODE_ENV === "development") {
	mountStoreDevtool("store", useStore);
}
