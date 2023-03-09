import { Button, Card, Stack } from "react-bootstrap";
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
        <Card>
            <Card.Header>
                <Card.Title as={"h4"} className="text-uppercase">
                    Demo
                </Card.Title>
            </Card.Header>

            <Card.Body>
                <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                    <div>
                        <Button variant="primary" onClick={pingGateway}>
                            Ping Gateway
                        </Button>
                    </div>
                </Stack>
            </Card.Body>
        </Card>
    );
}
