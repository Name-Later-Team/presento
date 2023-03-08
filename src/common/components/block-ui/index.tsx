import { createPortal } from "react-dom";
import "./style.scss";

export const GlobalBlockUI = ({ children, isTransparent }: { children?: JSX.Element; isTransparent?: boolean }) => {
	return createPortal(
		<div className="global-block-ui">
			{createPortal(
				<div
					className={`global-block-ui-backdrop${
						isTransparent ? " global-block-ui-backdrop--transparent" : ""
					}`}
				></div>,
				document.body,
			)}
			{children}
		</div>,
		document.body,
	);
};
