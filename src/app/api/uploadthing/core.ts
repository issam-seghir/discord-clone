import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
    const user = await auth();
    if (!user) throw new UploadThingError("Unauthorized");
    return { userId: user.userId };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);
			return { uploadedBy: metadata.userId };
		}),
	messageFile: f(["image", "pdf"])
		.middleware(() => handleAuth())
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);
			return { uploadedBy: metadata.userId };
		}),

	// 	// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
	// 	return { uploadedBy: metadata.userId };
	// }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
