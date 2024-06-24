"use client";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { Search, User } from "lucide-react";
import { useState, useEffect } from "react";
interface ServerSearchProps {
	data: {
		label: string;
		type: "channel" | "member";
		data:
			| {
					icon: React.ReactNode;
					id: string;
					name: string;
			  }[]
			| undefined;
	}[];
}

export function ServerSearch({ data }: ServerSearchProps) {
	const [open, setOpen] = useState(false);


	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
			>
				<Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
				<p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
					Search
				</p>
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
					<span className="text-xs">⌘</span>K
				</kbd>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search for channels or members" />
				<CommandList>
					<CommandEmpty>No results found</CommandEmpty>
					{data.map(({label,type,data})=>{
                        if(!data?.length) return null ;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({icon,id,name})=>(
                                    <CommandItem key={id} >
                                        {icon}
                                        <span>{name}</span>
                                        </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
				</CommandList>
			</CommandDialog>
		</>
	);
}
