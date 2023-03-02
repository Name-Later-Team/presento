import "./style.scss";

export interface ITableMaskProps {
	loading: boolean;
	indicator: JSX.Element;
	children?: React.ReactNode;
}

export function TableMask(props: ITableMaskProps) {
	const { loading, children, indicator } = props;

	return (
		<div className="table-mask-wrapper">
			{loading === true && <div className="table-mask-indicator">{indicator}</div>}
			<div className={`table-mask-overlay ${loading ? "show" : ""}`}>{children}</div>
		</div>
	);
}
