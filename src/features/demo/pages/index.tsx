import { Button, Stack } from "react-bootstrap";
import DashboardPageSkeleton from "../../../common/layouts/dashboard/dashboard-page-skeleton";
import { HttpService } from "../../../services";

export default function Demo() {
    const test = async () => {
        try {
            const res = await HttpService.get<any>(
                `/api/presento/v1/presentations/9e3c1073-4037-4670-8486-af7f1cdf9a71/slides/53`
            );
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardPageSkeleton pageTitle="Demo">
            <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                <div>
                    <Button variant="primary" onClick={test}>
                        Test Button
                    </Button>
                </div>
            </Stack>
        </DashboardPageSkeleton>
    );
}
