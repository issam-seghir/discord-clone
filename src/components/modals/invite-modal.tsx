"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrigin } from "@/hooks/use-origin";
import { useStore } from "@/store/store";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

export function InviteModal() {
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onOpen = useStore.use.onOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data();
	const isModelOpen = isOpen && type === "invite";
	const origin = useOrigin();

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const onGenerate = async () => {
		try {
			setIsLoading(true);
			const res = await axios.patch(`/api/servers/${data?.server?.id}/invite-code`);
			onOpen("invite", { server: res.data });
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent aria-describedby={undefined} className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Invite Friends</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
						Server invite link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							aria-readonly
							readOnly
							disabled={isLoading}
							className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button disabled={isLoading} onClick={onCopy} size="icon">
							{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
						</Button>
					</div>
					<Button
						onClick={onGenerate}
						disabled={isLoading}
						variant="link"
						size="sm"
						className="text-sm text-zinc-500 mt-4"
					>
						Generate a new link
						<RefreshCw className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
