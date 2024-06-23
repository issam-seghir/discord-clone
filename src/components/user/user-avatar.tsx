import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string ;
    className?: string;
}

export function UserAvatar({ src, className }: UserAvatarProps) {
	return (
		<Avatar className={cn("w-7 h-7 md:h-10 md:w-10", className)}>
			<AvatarImage src={src || "https://i.imgur.com/LFpAx5i.png"} alt="avatar" />
		</Avatar>
	);
}
