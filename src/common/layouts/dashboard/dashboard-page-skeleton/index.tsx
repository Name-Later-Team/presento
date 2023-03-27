import { ReactElement } from "react";
import { Card } from "react-bootstrap";
import { IBaseComponent } from "../../../interfaces";

interface IDashboardPageSkeletonProps extends IBaseComponent {
    children: ReactElement;
    pageTitle: string;
}

export default function DashboardPageSkeleton(props: IDashboardPageSkeletonProps) {
    const { children, pageTitle } = props;
    return (
        <Card>
            <Card.Header>
                <Card.Title as={"h4"} className="text-uppercase">
                    {pageTitle}
                </Card.Title>
            </Card.Header>

            <Card.Body>{children}</Card.Body>
        </Card>
    );
}
