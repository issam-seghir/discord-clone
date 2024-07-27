import { ourFileRouter } from "@/app/api/uploadthing/core";
import "@/app/globals.css";
import { ModalProvider } from "@/contexts/modal-provider";
import { QueryProvider } from "@/contexts/query-provider";
import { SocketProvider } from "@/contexts/socket-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Discord Clone",
	description: "A Full-Featured Real Time (Video , Audio , Chat) Application",
	openGraph: {
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body className={cn(open_sans.className, "bg-white dark:bg-[#313338]")}>
				<ClerkProvider
					appearance={{
						variables: { colorPrimary: "#000000" },
						elements: {
							formButtonPrimary:
								"bg-black border border-black border-solid hover:bg-white hover:text-black",
							socialButtonsBlockButton:
								"bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
							socialButtonsBlockButtonText: "font-semibold",
							formButtonReset:
								"bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
							membersPageInviteButton:
								"bg-black border border-black border-solid hover:bg-white hover:text-black",
							card: "bg-[#fafafa]",
						},
					}}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
						storageKey="discord-clone-theme"
						disableTransitionOnChange
					>
						<NextSSRPlugin
							/**
							 * The `extractRouterConfig` will extract **only** the route configs
							 * from the router to prevent additional information from being
							 * leaked to the client. The data passed to the client is the same
							 * as if you were to fetch `/api/uploadthing` directly.
							 */
							routerConfig={extractRouterConfig(ourFileRouter)}
						/>
						<SocketProvider>
							<QueryProvider>
								<ModalProvider />
								{children}
							</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
