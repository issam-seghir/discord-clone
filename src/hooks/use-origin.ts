import { useEffect, useState } from "react";

export function useOrigin() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	//? typeof window !== "undefined"  : check if code is running in the browser not in the server
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	if (!mounted) return "";
	return origin;
}
