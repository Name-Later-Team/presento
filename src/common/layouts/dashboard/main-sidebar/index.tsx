import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import CustomNavItem from "./custom-nav-item";
import "./style.scss";

export interface ISidebarNavItem {
    name: string;
    path: string;
    subNavs?: ISidebarNavItem[];
}

const mainSidebarNavigations: ISidebarNavItem[] = [
    {
        name: "Demo",
        path: "/dashboard/demo",
    },
    {
        name: "Danh sách bài trình bày",
        path: "/dashboard/presentation-list",
    },
];

export default function MainSidebar() {
    const location = useLocation();

    return (
        <Nav className="flex-column" variant="pills" activeKey={location.pathname}>
            {mainSidebarNavigations.map((nav) => (
                <CustomNavItem key={nav.path} {...nav} />
            ))}
        </Nav>
    );
}
