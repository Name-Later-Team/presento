import { Button, Stack } from "react-bootstrap";
import DashboardPageSkeleton from "../../../common/layouts/dashboard/dashboard-page-skeleton";
import { HttpService } from "../../../services";

export default function Demo() {
    const pingGateway = async () => {
        try {
            const res = await HttpService.get<any>("/api/presentation/ping");
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardPageSkeleton pageTitle="Demo">
            <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                <div>
                    <Button variant="primary" onClick={pingGateway}>
                        Ping Gateway
                    </Button>
                </div>
            </Stack>
        </DashboardPageSkeleton>
    );
}
