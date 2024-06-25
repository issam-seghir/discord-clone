"use client"
import { useState,useEffect,createContext,useContext, } from "react";

import { io as ClientIO} from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: {children : React.ReactNode}) => {
    const [socket, setSocket] = useState<any | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path : "/api/socket/io",
            addTrailingSlash : false,
        });
        client.on("connect", () => {
            setIsConnected(true);
        });
        client.on("disconnect", () => {
            setIsConnected(false);
        });
        setSocket(client);
        return () => {
            client.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
