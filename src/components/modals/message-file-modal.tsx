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
import { UploadDropzone } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import qs from "query-string";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";

export function MessageFileModal() {
	const router = useRouter();
    const type = useStore.use.type();
	const isOpen = useStore.use.isOpen();
	const onClose = useStore.use.onClose();
	const data = useStore.use.data();
    const isModalOpen = isOpen && type === "messageFile";

	const schema = z.object({
		fileUrl: z.string().min(1, { message: "Attachment is invalid" }),
	});
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			fileUrl: "",
		},
	});

	const { register, handleSubmit, formState, watch } = form;

	const isLoading = formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof schema>) => {
		try {
			const url = qs.stringifyUrl({
				url: data?.apiUrl || '',
				query: data?.query,
			});
			await axios.post(url, {...values ,content: values.fileUrl});
			router.refresh();
			form.reset();
			handleClose();
		} catch (error) {
			console.log(error);
		}
	};
    const handleClose = () => {
        form.reset();
        onClose();
    }
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Add an Attachment</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Upload an image or a document to share with your Friend
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												{field?.value && field?.value?.split(".").pop() !== "pdf" ? (
													<div className="relative h-20 w-20">
														<Image
															fill
															objectFit="cover"
															src={field.value}
															className="rounded-full"
															alt="Server Image"
														/>
														<Button
															onClick={() => field.onChange("")}
															type="button"
															className="w-7 h-7  p-[.35rem] absolute bg-rose-500 hover:bg-rose-800 text-white top-0 right-0 rounded-full shadow-sm"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-6 w-6 "
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M6 18L18 6M6 6l12 12"
																/>
															</svg>
														</Button>
													</div>
												) : (
													<UploadDropzone
														className="mt-4  focus-visible:outline-zinc-700
													focus-visible:outline-dashed
													ut-button:bg-indigo-500 ut-button:text-white ut-button:hover:bg-indigo-500/90 ut-button:ut-readying:bg-indigo-500/90 ut-button:ut-uploading:bg-indigo-500/90 ut-button:after:bg-indigo-700
													ut-label:text-zinc-700 ut-allowed-content:text-zinc-500
													"
														endpoint="messageFile"
														onClientUploadComplete={(res) => {
															field.onChange(res?.[0].url);
															console.log("Files: ", res);
															alert("Upload Completed");
														}}
														onUploadError={(error: Error) => {
															console.log("UploadthingERROR\n", error.message);

															alert(`ERROR! ${error.message}`);
														}}
														onUploadBegin={(name) => {
															// Do something once upload begins
															console.log("Uploading: ", name);
														}}
													/>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="bg-gray-100  px-6 py-4">
							<Button  type="submit" variant="primary" disabled={isLoading} className="w-full sm:w-20">
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
			<DialogFooter>
				<button className="btn btn-primary">Create server</button>
				<button className="btn">Join server</button>
			</DialogFooter>
		</Dialog>
	);
}
