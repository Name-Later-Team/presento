import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

export type IconToggleRef = HTMLButtonElement;

export interface IIconToggleProps<T> {
	children?: T;
	onClick: () => void | undefined;
}

export const FontAwesomeIconToggle = React.forwardRef<IconToggleRef, IIconToggleProps<typeof FontAwesomeIcon>>(
	(props, ref) => {
		return (
			<>
				<span className="btn btn-text-primary btn-icon rounded-pill" onClick={props.onClick} ref={ref}>
					{props.children as any || <FontAwesomeIcon icon={faEllipsisV} fontSize={"1.25rem"} />}
					{/* <FontAwesomeIcon icon={faEllipsisV} fontSize={"1.25rem"} /> */}
				</span>
			</>
		);
	},
);
