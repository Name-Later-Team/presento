import { Button, Stack } from "react-bootstrap";
import DashboardPageSkeleton from "../../../common/layouts/dashboard/dashboard-page-skeleton";
import useSocket from "../../../common/hooks/use-socket";
import { useEffect } from "react";

export default function Demo() {
    const { socket, status, methods } = useSocket();
    console.log(status);

    useEffect(() => {
        if (!socket) return;

        socket.on("present", (data) => console.log(data));
    }, [socket]);

    const initSocket = () => {
        methods.initSocket("/presentation");
    };

    const closeSocket = () => {
        methods.closeSocket();
    };

    const test = async () => {
        socket?.emit("join-room", "977949fe-6fff-4388-9641-7426c9daa5fb");
    };

    return (
        <DashboardPageSkeleton pageTitle="Demo">
            <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                <Stack direction="horizontal" gap={3}>
                    <Button variant="primary" onClick={test}>
                        Test Button
                    </Button>
                    <Button variant="primary" onClick={initSocket}>
                        Init Socket
                    </Button>
                    <Button variant="primary" onClick={closeSocket}>
                        Close Socket
                    </Button>
                </Stack>
            </Stack>
        </DashboardPageSkeleton>
    );
}
