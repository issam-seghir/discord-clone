import React from "react";

import { getCurrentProfile } from "@/lib/query";
import { redirect } from "next/navigation";


export default async function SideBar() {
	const profile = await getCurrentProfile();
	if (!profile) {
		return redirect("/");
	}



	return <div>SideBar</div>;
}
