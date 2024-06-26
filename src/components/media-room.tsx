"use client";

import { useUser } from "@clerk/nextjs";
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
	const { user } = useUser();
	const [token, setToken] = useState("");

	useEffect(() => {
		const name =
			user?.fullName ||
			user?.firstName ||
			user?.lastName ||
			user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
			"unknown";
		if (!name) return;
		(async () => {
			console.log("resp");
			try {
				const resp = await fetch(`/api/get-participant-token?room=${chatId}&username=${name}`);

				const data = await resp.json();
				setToken(data.token);
			} catch (e) {
				console.error(e);
			}
		})();
	}, [chatId, user?.firstName, user?.lastName, user?.fullName, user?.primaryEmailAddress?.emailAddress]);

	if (token === "") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-zinc-500 dark:text-zinc-400 text-xs">Loading...</p>
			</div>
		);
	}

	return (
		<LiveKitRoom
			video={video}
			audio={audio}
			token={token}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			connect={true}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			style={{ height: "100dvh" }}
		>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer />
			{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
			<ControlBar />
		</LiveKitRoom>
	);
}

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false }
	);
	return (
		<GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}
