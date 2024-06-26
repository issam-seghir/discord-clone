"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";

export function DeleteMessageModal() {
	const router = useRouter();
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data();
	const isModelOpen = isOpen && type === "deleteMessage";
	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteServer = async () => {
		try {
			setIsLoading(true);
			const url = qs.stringifyUrl({
				url: data?.apiUrl || "",
				query: data?.query,
			});
			await axios.delete(url);
			onClose();
			router.refresh();
		} catch (error: any) {
			console.log(error, "DELETE MESSAGE ERROR");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent aria-describedby={undefined} className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Delete Message</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						The Message will be permanently deleted !!
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4 bg-gray-100">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button disabled={isLoading} onClick={handleDeleteServer} variant="primary">
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
