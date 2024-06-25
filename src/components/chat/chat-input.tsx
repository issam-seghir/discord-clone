"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import qs from "query-string";
import { useStore } from "@/store/store";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { useRouter } from "next/navigation";
interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: "conversation" | "channel";
}

const formSchema = z.object({
	content: z.string().min(1),
});
export function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
	const router = useRouter();
	const onOpen = useStore.use.onOpen();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            });
            await axios.post(url, values);
			form.reset();
			router.refresh();
        } catch (error) {
            console.error(error);
        }
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									<button
										type="button"
										onClick={() =>onOpen("messageFile", { apiUrl,query })}
										className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input
										disabled={isLoading}
										className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
										placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
										{...field}
									/>
									<div className="absolute top-7 right-8">
										<EmojiPicker onChange={
											(value) => form.setValue("content", field.value + " " + value)
										} />
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
