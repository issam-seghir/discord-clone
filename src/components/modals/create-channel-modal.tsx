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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select ,SelectContent,SelectLabel,SelectItem,SelectTrigger, SelectValue} from "@/components/ui/select";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import qs from "query-string";
import { useEffect } from "react";


export function CreateChannelModal() {
	const router = useRouter();
    const params = useParams()
	const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data();

	const isModelOpen = isOpen && type === "createChannel";

	const schema = z.object({
		name: z
			.string()
			.min(1, { message: "Channel name is required" })
			.refine((name) => name !== "general", {
				message: "Channel name can't be 'general'",
			}),
		type: z.nativeEnum(ChannelType),
	});
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			type: data?.channelType || ChannelType.TEXT,
		},
	});

	useEffect(() => {
		if (data?.channelType) {
			form.setValue("type", data?.channelType);
		} else {
			form.setValue("type", ChannelType.TEXT);
		}
	}, [data?.channelType, form]);


	const { register, handleSubmit, formState, watch } = form;

	const isLoading = formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof schema>) => {
		console.log(values);
		try {
            const url = qs.stringifyUrl({
                url: `/api/channels`,
                query: {
                    serverId: params?.serverId,
                },
            });
			await axios.post(url, values);
			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};
	const handleClose = () => {
		form.reset();
		onClose();
	};
	return (
		<Dialog open={isModelOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Create Channel</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Channels are where your members communicate. <br />
						for example #general.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Chanel name
										</FormLabel>

										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter Channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
											<Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black  ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                    >
                                                        <SelectValue  placeholder="Select a channel type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(ChannelType).map((type) => (
                                                        <SelectItem key={type} value={type} className="capitalize">
                                                            {type?.toLocaleLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button type="submit" variant="primary" disabled={isLoading} className="w-full">
								Create Channel
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
			<DialogFooter>
				<button className="btn btn-primary">Create Channel</button>
			</DialogFooter>
		</Dialog>
	);
}
