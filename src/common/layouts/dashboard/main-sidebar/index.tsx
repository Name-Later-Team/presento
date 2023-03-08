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
        name: "Navigation",
        path: "",
        subNavs: [
            {
                name: "Sub-nav 1",
                path: "/dashboard/1",
            },
            {
                name: "Sub-nav 2",
                path: "/dashboard/2",
            },
            {
                name: "Sub-nav 3",
                path: "/dashboard/3",
            },
            {
                name: "Demo",
                path: "/dashboard/demo",
            },
        ],
    },
    // {
    //     name: "Demo",
    //     path: "/dashboard/demo",
    // },
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
