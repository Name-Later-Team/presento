import { Tab, Tabs } from "react-bootstrap";
import ParagraphContentTab from "./tabs/content-tab";
import CustomizeTab from "../default/tabs/customize-tab";
import "./style.scss";

export default function ParagraphConfig() {
    return (
        <Tabs className="presentation-tabs__container" justify>
            <Tab eventKey="content" title="Nội dung">
                <ParagraphContentTab />
            </Tab>
            <Tab eventKey="customize" title="Tùy chỉnh">
                <CustomizeTab />
            </Tab>
        </Tabs>
    );
}
