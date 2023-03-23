import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ISidebarSlideNav } from "..";
import { usePresentFeature } from "../../../../contexts/present-feature-context";
import { IBaseComponent } from "../../../../interfaces";
import { CustomActionDropdownToggle } from "../custom-action-dropdown";
import "./style.scss";
import CustomizedTooltip from "../../../../components/tooltip";
import React from "react";
import { DraggableProvided } from "react-beautiful-dnd";

interface ICustomSlideNav extends IBaseComponent, ISidebarSlideNav {
    slideNum?: number;
    actions?: {
        onDelete: (adminKey: string) => void;
    };
    draggableProvided: DraggableProvided;
}

const CustomSlideNav = React.forwardRef<HTMLDivElement, ICustomSlideNav>((props, ref) => {
    const { presentationState } = usePresentFeature();
    const { icon, typeLabel, path, slideId, slideNum, actions, draggableProvided } = props;
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(path);
    };

    const handleDeleteSlide = (slideId: string) => {
        actions?.onDelete(slideId);
    };

    return (
        <div
            ref={ref}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            className="custom-slide-nav__container"
        >
            <Nav.Item className="custom-slide-nav__slide">
                <Nav.Link className="custom-slide-nav__slide-link" onClick={handleOnClick} eventKey={path}>
                    <div className="d-flex justify-content-between">
                        <div className="custom-slide-nav__slide-control fs-5">
                            <div className="custom-slide-nav__slide-info w-100">
                                <span className="custom-slide-nav__slide-number mb-1">{slideNum}</span>

                                {presentationState.pace.active === slideId ? (
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className="d-flex justify-content-center align-items-center w-100"
                                    >
                                        <FontAwesomeIcon
                                            id="custom-slide-nav__slide-is-presenting"
                                            icon={faPlay}
                                            size="sm"
                                        />
                                        <CustomizedTooltip
                                            place="right"
                                            anchorSelect="#custom-slide-nav__slide-is-presenting"
                                            content="Trang này đang được trình chiếu"
                                        />
                                    </span>
                                ) : null}
                            </div>

                            <Dropdown
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="custom-slide-nav__custom-dropdown"
                            >
                                <Dropdown.Toggle as={CustomActionDropdownToggle}></Dropdown.Toggle>
                                <Dropdown.Menu style={{ margin: 0 }} renderOnMount popperConfig={{ strategy: "fixed" }}>
                                    <Dropdown.Item
                                        className="text-danger"
                                        as="button"
                                        onClick={() => handleDeleteSlide(slideId)}
                                    >
                                        <FontAwesomeIcon className="me-3" icon={faTrash} />
                                        Xóa trang chiếu
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="custom-slide-nav__slide-preview">
                            <span className="custom-slide-nav__slide-name">
                                <FontAwesomeIcon icon={icon} />
                                <span style={{ fontSize: "0.8rem" }}>{typeLabel}</span>
                            </span>
                        </div>
                    </div>
                </Nav.Link>
            </Nav.Item>
        </div>
    );
});

export default CustomSlideNav;
