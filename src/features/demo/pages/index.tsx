import { Button, Stack } from "react-bootstrap";
import DashboardPageSkeleton from "../../../common/layouts/dashboard/dashboard-page-skeleton";
import useSocket from "../../../common/hooks/use-socket";

export default function Demo() {
    const { methods } = useSocket();

    const initSocket = () => {
        methods.initSocket();
    };

    const closeSocket = () => {
        methods.closeSocket();
    };

    const test = async () => {
        console.log("Clicked test button");
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
