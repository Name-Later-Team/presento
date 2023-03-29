import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack } from "react-bootstrap";
import { Notification } from "../../../../common/components/notification";
import CustomizedTooltip from "../../../../common/components/tooltip";
import { APP_CONSTANTS } from "../../../../constants/app-constants";
import { usePresentFeature } from "../../../../common/contexts/present-feature-context";
import HeadingSlideComponent from "./components/heading";
import MultipleChoiceSlideComponent from "./components/multiple-choice";
import ParagraphSlideComponent from "./components/paragraph";
import "./style.scss";
import FormatUtil from "../../../../common/utils/format-util";
import { SUCCESS_NOTIFICATION } from "../../../../constants";

// define all types of slide here
const slideTypeComponents: { [type: string]: JSX.Element } = {
    multiple_choice: <MultipleChoiceSlideComponent />,
    heading: <HeadingSlideComponent />,
    paragraph: <ParagraphSlideComponent />,
};

export default function PresentationSlide() {
    const { slideState, presentationState } = usePresentFeature();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${APP_CONSTANTS.APP_DOMAIN}/${presentationState.voteKey}`);
        Notification.notifySuccess(SUCCESS_NOTIFICATION.COPIED_LINK_SUCCESS);
    };

    return (
        <div className="presentation-slide__slide-wrapper">
            <div className="presentation-slide__slide text-break">
                <Stack className="text-center h-100" gap={3}>
                    {slideState.showInstructionBar && (
                        <>
                            <div className="presentation-slide__instruction-bar">
                                <div
                                    className="presentation-slide__instruction-bar__content-wrapper"
                                    id="instruction-bar__vote-link"
                                    onClick={handleCopyLink}
                                >
                                    Truy cập
                                    <span className="instruction-bar__vote-link mx-2 fw-bolder text-primary">
                                        {APP_CONSTANTS.APP_DOMAIN}
                                    </span>
                                    nhập mã
                                    <span className="instruction-bar__vote-link mx-2 fw-bolder text-primary">
                                        {FormatUtil.formatVotingCodeString(presentationState.votingCode)}
                                    </span>
                                    để bầu chọn
                                </div>
                            </div>
                            <CustomizedTooltip place="bottom" anchorSelect="#instruction-bar__vote-link">
                                Nhấn để sao chép đường dẫn bầu chọn
                            </CustomizedTooltip>
                        </>
                    )}

                    <div className="presentation-slide__slide-component flex-grow-1">
                        {slideTypeComponents[slideState.type]}
                    </div>

                    <div className="presentation-slide__footer-placeholder">
                        <div className="presentation-slide__footer">
                            <div className="d-flex align-items-center">
                                <div className="footer__team-logo-wrapper me-2">
                                    <img
                                        className="footer__team-logo"
                                        src="/images/logo-presento-transparent.png"
                                        alt="logo-presento-transparent"
                                    />
                                </div>
                            </div>

                            {/* Display the number of people who voted on this question */}
                            <div id="footer__total-respondents">
                                {slideState.respondents}
                                <FontAwesomeIcon className="footer__total-respondents-logo ms-2" icon={faUser} />
                            </div>
                            <CustomizedTooltip
                                place="left"
                                anchorSelect="#footer__total-respondents"
                                content="Tổng người đã bầu chọn"
                            />
                        </div>
                    </div>
                </Stack>
            </div>
        </div>
    );
}
