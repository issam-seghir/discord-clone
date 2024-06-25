import { NextApiResponseServerIo } from "@/types/server";
import { NextApiRequest } from "next";
import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

export const config = {
	api: {
		bodyParser: false,
	},
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
	if (!res.socket.server.io) {
		const path = "/api/socket/io";
		const httpServer: HttpServer = res.socket.server as any;
		const io = new SocketIOServer(httpServer, {
			path,
			addTrailingSlash: false,
		});
		res.socket.server.io = io;
	}
	res.end();
};

export default ioHandler;
