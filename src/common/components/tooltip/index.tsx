import { ElementType, ReactNode, CSSProperties } from "react";
import ReactDOM from "react-dom";
import { Tooltip } from "react-tooltip";

// interface was copied from react-tooltip lib
type PlacesType = "top" | "right" | "bottom" | "left";

type VariantType = "dark" | "light" | "success" | "warning" | "error" | "info";

type WrapperType = ElementType | "div" | "span";

type ChildrenType = Element | ElementType | ReactNode;

type EventsType = "hover" | "click";

type PositionStrategy = "absolute" | "fixed";

/**
 * @description floating-ui middleware
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Middleware = any;

interface IPosition {
    x: number;
    y: number;
}

interface ICustomizedTooltip {
    className?: string;
    classNameArrow?: string;
    content?: string;
    html?: string;
    place?: PlacesType;
    offset?: number;
    id?: string;
    variant?: VariantType;
    /**
     * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
     * See https://react-tooltip.com/docs/getting-started
     */
    anchorId?: string;
    anchorSelect?: string;
    wrapper?: WrapperType;
    children?: ChildrenType;
    events?: EventsType[];
    positionStrategy?: PositionStrategy;
    middlewares?: Middleware[];
    delayShow?: number;
    delayHide?: number;
    float?: boolean;
    noArrow?: boolean;
    clickable?: boolean;
    closeOnEsc?: boolean;
    style?: CSSProperties;
    position?: IPosition;
    isOpen?: boolean;
    setIsOpen?: (value: boolean) => void;
    afterShow?: () => void;
    afterHide?: () => void;
}

export default function CustomizedTooltip(props: ICustomizedTooltip) {
    return ReactDOM.createPortal(
        <Tooltip {...props} className="rc-tooltip" />,
        document.querySelector("body") as HTMLElement
    );
}
