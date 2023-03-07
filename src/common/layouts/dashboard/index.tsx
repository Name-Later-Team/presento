import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IBaseComponent } from "../../interfaces/basic-interfaces";
import "./style.scss";

interface IDashboardLayout extends IBaseComponent {
    sidebarElement: ReactElement;
}

export default function DashboardLayout(props: IDashboardLayout) {
    const { sidebarElement } = props;
    const userInfo: { avatar?: string } = {};
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        // removeUserInfo();
    };

    return (
        <div className="dashboard-layout">
            <div
                className={`dashboard-layout__backdrop${isCollapsed ? " dashboard-layout__backdrop--collapsed" : ""}`}
                onClick={() => !isCollapsed && setIsCollapsed(true)}
            >
                <aside className="dashboard-layout__sidebar-container" onClick={(e) => e.stopPropagation()}>
                    <Button
                        className={`sidebar-container__close-btn${
                            isCollapsed ? " sidebar-container__close-btn--collapsed" : ""
                        }`}
                        variant="light"
                        onClick={() => setIsCollapsed(true)}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} size="lg" />

                        <span className="ms-3">Đóng</span>
                    </Button>
                    <div className="sidebar-container__app-logo text-primary text-capitalize">
                        <Link to="/">
                            <div className="app-logo__container">
                                <img
                                    className="app-logo__container__app-logo"
                                    src="/images/logo-presento-transparent.png"
                                    alt="app-logo"
                                    loading="lazy"
                                />
                            </div>
                        </Link>
                    </div>
                    {sidebarElement}
                </aside>
            </div>
            <div className="dashboard-layout__main-content">
                <div className="main-content__static-header">
                    <Button className="static-header__menu-btn" variant="light" onClick={() => setIsCollapsed(false)}>
                        <FontAwesomeIcon className="text-primary" icon={faBars} size="lg" />
                    </Button>
                    <div className="static-header__header-actions">
                        <Dropdown>
                            <Dropdown.Toggle className="static-header__avatar-dropdown-btn" variant="light">
                                <img
                                    className="static-header__avatar"
                                    src={`${userInfo?.avatar || "/images/default-avatar.png"}`}
                                    alt=""
                                    loading="lazy"
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ margin: 0 }}>
                                <Dropdown.Item onClick={() => navigate("/profile")}>Hồ sơ cá nhân</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="main-content__dynamic-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
