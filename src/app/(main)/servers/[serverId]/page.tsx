import { getCurrentProfile, getGeneralServer } from "@/lib/query";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
	params: {
		serverId: string;
	};
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return auth().redirectToSignIn();
	}
	const server = await getGeneralServer(params.serverId, profile.id);

    if(server){
        redirect(`/servers/${params.serverId}/channels/${server?.channels?.[0]?.id}`);
    }
    if (!server) {
        return auth().redirectToSignIn();
    }
	return <div>New server</div>;
}
