import { Member, Profile, Message,Server } from "@prisma/client";
import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "node:net";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};


export type MessagesWithMemberWithProfile = Message & {
	member: Member & { profile: Profile };
};
