import { useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { APP_CONSTANTS } from "../../constants/app-constants";
import { useAuth } from "../contexts/auth-context";
import SocketService from "../../services/socket-service";
import { Notification } from "../components/notification";
import { SOCKET_ERROR_MESSAGE, SOCKET_NAMESPACE } from "../../constants";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

// define all available socket status
export enum SOCKET_STATUS {
    notInitialized,
    isConnecting,
    isConnected,
    isClosed,
    isRetrying,
    maxRetryingAttempt,
}

interface IUseSocket {
    /**
     * A socket instance created by socket.io
     */
    socket: Socket | null;
    /**
     * Status indicator for the socket instance
     */
    status: SOCKET_STATUS;
    /**
     * Contains all methods that this hook provides
     */
    methods: {
        /**
         * Initialize a socket instance
         * @param namespace a namespace that will be used to connect to the socket server, undefined = default namespace
         * @returns void
         */
        initSocket: (namespace?: string) => void;
        /**
         * Close the currently opened socket
         * @returns void
         */
        closeSocket: () => void;
        /**
         * Force to reconnect to the socket server using the same namespace
         * @returns void
         */
        forceReconnect: () => void;
    };
}

// max reconnecting attempt
const MAX_RETRY_CONNECT = 3;

// default state's values
const defaultStates = {
    socket: null,
    ticket: null,
    namespace: "",
    retryNo: 0,
    socketStatus: SOCKET_STATUS.notInitialized,
};

export default function useSocket(): IUseSocket {
    // contexts
    const { userInfo } = useAuth();

    // states
    const [socket, setSocket] = useState<Socket | null>(defaultStates.socket);
    const [ticket, setTicket] = useState<string | null>(defaultStates.ticket);
    const [namespace, setNamespace] = useState(defaultStates.namespace);
    const [retryNo, setRetryNo] = useState<number>(defaultStates.retryNo);
    const [socketStatus, setSocketStatus] = useState<SOCKET_STATUS>(defaultStates.socketStatus);

    // memorized functions
    const getAuthTicket = useCallback(async () => {
        try {
            const res = await SocketService.postAuthenticationTicketAsync();
            if (res.code === 201) {
                setTicket(res.data?.ticket || "");
                return;
            }

            throw new Error("Unhandled code");
        } catch (err) {
            console.error(err);
            return;
        }
    }, []);

    const initConnectSocket = useCallback(() => {
        setSocketStatus(SOCKET_STATUS.isConnecting);
        setRetryNo(defaultStates.retryNo);
        getAuthTicket();
    }, [getAuthTicket]);

    // effects
    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            // determine socket state
            setSocketStatus(SOCKET_STATUS.isConnected);
            console.log("Socket opened");
        });

        socket.on("connect_error", (error) => {
            if (error.message === SOCKET_ERROR_MESSAGE.handshake_error) {
                setRetryNo((prev) => prev + 1);
            }
        });

        return () => {
            socket?.close();
            console.log("Socket cleaned up");
        };
    }, [socket]);

    useEffect(() => {
        if (ticket !== null) {
            const newSocket = io(APP_CONSTANTS.SOCKET_DOMAIN + namespace, {
                auth: { ticket: ticket, identifier: userInfo.userId || "" },
            });

            setSocket((oldSocket) => {
                oldSocket?.close();

                return newSocket;
            });
        }
    }, [ticket, userInfo.userId, namespace]);

    useEffect(() => {
        if (retryNo === 0) return;
        if (retryNo >= MAX_RETRY_CONNECT) {
            const reconnectToastId = Notification.notifyError(
                <div className="d-flex align-items-center flex-wrap">
                    <span className="flex-grow-1">Mất kết nối</span>
                    <Button
                        variant="light"
                        className="mx-2 p-1 px-2 d-flex justify-content-center align-items-center"
                        onClick={() => {
                            Notification.dismiss(reconnectToastId);
                            initConnectSocket();
                        }}
                    >
                        <FontAwesomeIcon className="me-2" icon={faRotateRight} />
                        Kết nối lại
                    </Button>
                </div>,
                {
                    autoClose: false,
                }
            );
            return;
        }

        getAuthTicket();
    }, [retryNo, getAuthTicket, initConnectSocket]);

    // handling functions
    const createSocket = useCallback(
        (namespace: string = SOCKET_NAMESPACE.default) => {
            setNamespace(namespace);
            initConnectSocket();
        },
        [initConnectSocket]
    );

    const closeSocket = useCallback(() => {
        socket?.close();
        setSocketStatus(SOCKET_STATUS.isClosed);
    }, [socket]);

    const forceReconnect = useCallback(() => {
        initConnectSocket();
    }, [initConnectSocket]);

    // determine socket state
    if (retryNo < MAX_RETRY_CONNECT && retryNo > 0 && socketStatus !== SOCKET_STATUS.isRetrying) {
        setSocketStatus(SOCKET_STATUS.isRetrying);
    }

    if (retryNo >= MAX_RETRY_CONNECT && socketStatus !== SOCKET_STATUS.maxRetryingAttempt) {
        setSocketStatus(SOCKET_STATUS.maxRetryingAttempt);
    }

    return {
        socket: socket,
        status: socketStatus,
        methods: {
            initSocket: createSocket,
            closeSocket: closeSocket,
            forceReconnect: forceReconnect,
        },
    };
}
