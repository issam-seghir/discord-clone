import { createUserModelSlice } from "@/store/use-modal-slice";
import { Store } from "@/types/store";
import { createSelectorFunctions, ZustandFuncSelectors } from "auto-zustand-selectors-hook";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

//? Create the Global store
//* plugins :
//* 1. persist : To persist the store in localstorage
//* 2. devtools : To use the redux devtools extension
//* 3. subscribeWithSelector : To use the scribe selectors
//* 4. immer : To use the immer for immutability

const useStoreBase = create<Store>()(
	devtools(
		persist(
			subscribeWithSelector(
				immer((...a) => ({
					...createUserModelSlice(...a),
				}))
			),
			{
				name: "store", // localStorage key
			}
		)
	)
);

//? Auto generated selectors for the store using 'auto-zustand-selectors-hook'
//* Usage : useStore.use.selectorName()

export const useStore = createSelectorFunctions(useStoreBase) as typeof useStoreBase & ZustandFuncSelectors<Store>;

//? Setup the devtools using 'simple-zustand-devtools'
//* You can use Redux Devtools Extension as well , with the built in  'zustand/middleware'

if (process.env.NODE_ENV === "development") {
	mountStoreDevtool("store", useStore);
}
