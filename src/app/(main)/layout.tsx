export default async function Layout({ children }: { children: React.ReactNode }) {
	return (
		<section className="h-full">
			<div className="hidden md:flex w-[72px] z-30 flex-col fixed inset-y-0">
                <aside className="h-full bg-white border-r border-gray-200">
                    <nav className="flex flex-col h-full">
                        <a href="/" className="flex items-center justify-center h-[72px] border-b border-gray-200">
                            <img src="/assets/logo.svg" alt="Logo" className="w-[24px] h-[24px]" />
                        </a>
                    </nav>
                </aside>
            </div>

			<main className="h-full md:pl-[72px]">{children}</main>
		</section>
	);
}
