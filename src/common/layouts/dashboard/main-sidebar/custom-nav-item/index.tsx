import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ISidebarNavItem } from "..";
import { IBaseComponent } from "../../../../interfaces";
import "./style.scss";

interface ICustomNavItem extends IBaseComponent, ISidebarNavItem {}

export default function CustomNavItem(props: ICustomNavItem) {
    const { name, path, subNavs } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        !isExpanded &&
            subNavs &&
            subNavs.findIndex((nav) => nav.path === location.pathname) !== -1 &&
            setIsExpanded(true);
        // eslint-disable-next-line
    }, []);

    const handleOnClick = () => {
        if (subNavs !== undefined) {
            setIsExpanded((curVal) => !curVal);
            return;
        }

        navigate(path);
    };

    return (
        <div className="custom-nav-item__container">
            <Nav.Item>
                <Nav.Link
                    className={`${isExpanded ? " custom-nav-item__parent-nav--active" : ""}`}
                    onClick={handleOnClick}
                    eventKey={subNavs ? undefined : path}
                >
                    <div className="d-flex justify-content-between">
                        <span className="custom-nav-item__nav-name">{name}</span>
                        {subNavs && (
                            <span
                                className={`custom-nav-item__nav-expand${
                                    !isExpanded ? "" : " custom-nav-item__nav-expand--flip"
                                }`}
                            >
                                <FontAwesomeIcon icon={faCaretDown} />
                            </span>
                        )}
                    </div>
                </Nav.Link>
            </Nav.Item>
            {subNavs && (
                <div
                    className={`custom-nav-item__sub-nav-container${
                        isExpanded ? "" : " custom-nav-item__sub-nav-container--collapsed"
                    }`}
                >
                    {subNavs.map((subNav) => (
                        <Nav.Item className="nav-item__sub-nav" key={subNav.path}>
                            <Nav.Link onClick={() => navigate(subNav.path)} eventKey={subNav.path}>
                                {subNav.name}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </div>
            )}
        </div>
    );
}
