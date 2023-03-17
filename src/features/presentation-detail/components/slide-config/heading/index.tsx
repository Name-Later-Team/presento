import { Tab, Tabs } from "react-bootstrap";
import HeadingContentTab from "./tabs/content-tab";
import HeadingCustomizeTab from "./tabs/customize-tab";
import "./style.scss";

export default function HeadingConfig() {
	return (
		<Tabs className="presentation-tabs__container" justify>
			<Tab eventKey="content" title="Nội dung">
				<HeadingContentTab />
			</Tab>
			<Tab eventKey="customize" title="Tùy chỉnh">
				<HeadingCustomizeTab />
			</Tab>
		</Tabs>
	);
}
