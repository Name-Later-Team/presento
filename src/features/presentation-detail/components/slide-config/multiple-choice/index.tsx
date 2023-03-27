import { Tab, Tabs } from "react-bootstrap";
import MultipleChoiceContentTab from "./tabs/content-tab";
import MultipleChoiceCustomizeTab from "./tabs/customize-tab";
import "./style.scss";

export default function MultipleChoiceConfig() {
	return (
		<Tabs className="presentation-tabs__container" justify>
			<Tab eventKey="content" title="Nội dung">
				<MultipleChoiceContentTab />
			</Tab>
			<Tab eventKey="customize" title="Tùy chỉnh">
				<MultipleChoiceCustomizeTab />
			</Tab>
		</Tabs>
	);
}
