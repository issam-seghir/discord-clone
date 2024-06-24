"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrigin } from "@/hooks/use-origin";
import { useStore } from "@/store/store";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteServerModal() {
	const router = useRouter();
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onOpen = useStore.use.onOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data();
	const isModelOpen = isOpen && type === "deleteServer";
	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteServer = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/servers/${data?.server?.id}`);
			onClose();
			router.refresh();
			router.push("/");
		} catch (error: any) {
			console.log(error, "LEAVE SERVER ERROR");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent aria-describedby={undefined} className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Delete Server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to Delete{" "}
						<span className="text-indigo-500 font-semibold">{data?.server?.name}</span> Server ?
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
