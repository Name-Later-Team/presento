import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner, Stack } from "react-bootstrap";
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
export type SlideType = "multiple_choice" | "heading" | "paragraph";
export const slideTypeComponents: Record<SlideType, JSX.Element> = {
    multiple_choice: <MultipleChoiceSlideComponent />,
    heading: <HeadingSlideComponent />,
    paragraph: <ParagraphSlideComponent />,
};

export default function PresentationSlide() {
    const { slideState, presentationState } = usePresentFeature();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${APP_CONSTANTS.VOTE_APP_DOMAIN}/${presentationState.identifier}`);
        Notification.notifySuccess(SUCCESS_NOTIFICATION.COPIED_LINK_SUCCESS);
    };

    return (
        <div className="presentation-slide__slide-wrapper">
            <div className="presentation-slide__slide text-break">
                <Stack className="presentation-slide__slide__slide-stack text-center h-100">
                    {slideState.showInstructionBar && (
                        <>
                            <div className="presentation-slide__instruction-bar">
                                <div
                                    className="presentation-slide__instruction-bar__content-wrapper"
                                    id="instruction-bar__vote-link"
                                    onClick={() => presentationState.votingCode.code !== "" && handleCopyLink()}
                                >
                                    Truy cập
                                    <span className="fw-bolder text-primary" style={{ marginInline: "0.5vw" }}>
                                        {APP_CONSTANTS.VOTE_APP_DOMAIN}
                                    </span>
                                    nhập mã
                                    <span className="fw-bolder text-primary" style={{ marginInline: "0.5vw" }}>
                                        {presentationState.votingCode.code === "" ? (
                                            <Spinner
                                                className="vote-link__voting-code--spinner mx-2"
                                                animation="border"
                                                variant="primary"
                                            />
                                        ) : (
                                            FormatUtil.formatVotingCodeString(presentationState.votingCode.code)
                                        )}
                                    </span>
                                    để bầu chọn
                                </div>
                            </div>
                            {presentationState.votingCode.code !== "" && (
                                <CustomizedTooltip place="bottom" anchorSelect="#instruction-bar__vote-link">
                                    Nhấn để sao chép đường dẫn bầu chọn
                                </CustomizedTooltip>
                            )}
                        </>
                    )}

                    <div className="presentation-slide__slide-component flex-grow-1">
                        {slideTypeComponents[slideState.type as SlideType]}
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
                                <span>{slideState.respondents}</span>
                                <FontAwesomeIcon className="footer__total-respondents-logo" icon={faUser} />
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
