import { SideBar } from "@/components/layout/side-bar";

export default async function Layout({ children }: { children: React.ReactNode }) {
	return (
		<section className="h-full">
			<div className="hidden md:flex w-[72px] z-30 flex-col fixed inset-y-0">
				<SideBar />
			</div>

			<main className="h-full md:pl-[72px]">{children}</main>
		</section>
	);
}
