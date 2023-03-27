import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CustomizedTooltip from "../../../../components/tooltip";
import "./style.scss";

export const CustomActionDropdownToggle = React.forwardRef<
    HTMLButtonElement,
    { onClick: (e: React.MouseEvent<HTMLSpanElement>) => void | undefined }
>((props, ref) => {
    const id = `custom-slide-nav__slide-dropdown-toggle-${Math.floor(Math.random() * Date.now()).toString(16)}`;
    return (
        <>
            <span
                onClick={(e) => {
                    e.preventDefault();
                    props.onClick(e);
                }}
                ref={ref}
                className="custom-slide-nav__slide-dropdown-control"
                id={id}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </span>
            <CustomizedTooltip place="right" anchorSelect={`#${id}`} content="Thao tác" />
        </>
    );
});
