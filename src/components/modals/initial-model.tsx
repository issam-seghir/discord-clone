"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form,FormControl,FormDescription ,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";


export function InitialModel() {

	const schema = z.object({
		name: z.string().min(1,{message: "Server name is required"}),
		imageUrl: z.string().min(1,{message: "Image URL is invalid"}),
	});
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			imageUrl: "",

		},

	});

	const {register, handleSubmit, formState} = form;
	const isLoading =  formState.isSubmitting;

	const onSubmit = async (values : z.infer<typeof schema>) => {
		console.log(values);
	};
	return (
		<Dialog open>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Customize your server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Give your sever a personality with a name and an image. You can always change these later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<UploadButton
									className="mt-4 ut-button:bg-indigo-500 ut-button:text-white ut-button:hover:bg-indigo-500/90 ut-button:ut-readying:bg-indigo-500/90"
									endpoint="serverImage"
									onClientUploadComplete={(res) => {
										// Do something with the response
										console.log("Files: ", res);
										alert("Upload Completed");
									}}
									onUploadError={(error: Error) => {
										// Do something with the error.
										alert(`ERROR! ${error.message}`);
									}}
									onUploadBegin={(name) => {
										// Do something once upload begins
										console.log("Uploading: ", name);
									}}
								/>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Server name
										</FormLabel>

										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <Button type="submit" isLoading={isLoading} className="w-full mt-4">Create server</Button> */}
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button type="submit" variant="primary" disabled={isLoading} className="w-full">
								Create server
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
