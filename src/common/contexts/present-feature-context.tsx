import { createContext, useContext, useRef, useState } from "react";
import { IBaseComponent, IBaseResponse, IOptionsResponse, IVotingCodeResponse } from "../interfaces";
import _ from "lodash";
import SlideService from "../../services/slide-service";
import DataMappingUtil from "../utils/data-mapping-util";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../constants";
import { Notification } from "../components/notification";

// interfaces
export interface ISlideState {
    question: string;
    description: string;
    options: IOptionsResponse[];
    selectedOption: string; // contains the key of the correct option in options field
    enableVoting: boolean;
    showInstructionBar: boolean;
    fontSize: number;
    type: string;
    config: any;
    createdAt: string;
    updatedAt: string;
    questionImageUrl: string;
    questionVideoUrl: string;
    speakerNotes: string;
    id: string;
    position: string;
    presentationId: string;
    presentationSeriesId: string;
    result: { key: string; value: number }[]; // option's key and the number of people who have chosen this option
    respondents: number; // the total number of people who have voted on this poll
}

export interface IPresentationSlide {
    id: string;
    type: string;
    position: number;
}

export interface IPresentationPace {
    active_slide_id: string;
    counter: number;
    mode: string;
    state: "idle" | "presenting" | "";
}

export interface IPresentationState {
    identifier: string;
    name: string;
    ownerDisplayName: string;
    ownerIdentifier: string;
    slides: IPresentationSlide[];
    pace: IPresentationPace;
    totalSlides: number;
    updatedAt: string;
    votingCode: IVotingCodeResponse;
}

interface IPresentFeatureContext {
    /**
     * State to indicate that GENERAL data has been changed or not
     */
    isModified: boolean;
    /**
     * State to indicate that EACH data has been changed or not
     */
    isModifiedDetail: {
        isSlidesListModified: boolean;
        isSlideDetailModified: boolean;
    };

    /**
     * Access and change state that has information relating to a slide
     */
    slideState: ISlideState;
    /**
     * Change slide state and set the modified indicator to true
     * @returns void
     */
    changeSlideState: (newSlideState: Partial<ISlideState>) => void;
    /**
     * Change slide state and reset the modified indicator to false, if there is no argument was passed, the function will keep the old state and only reset the modified indicator
     * @returns void
     */
    resetSlideState: (newSlideState?: Partial<ISlideState>) => void;

    /**
     * Access and change state that has information relating to a presentation
     */
    presentationState: IPresentationState;
    /**
     * Change presentation state and set the modified indicator to true
     * @returns void
     */
    changePresentationState: (newPresentationState: Partial<IPresentationState>) => void;
    /**
     * Change presentation state and reset the modified indicator to false, if there is no argument was passed, the function will keep the old state and only reset the modified indicator
     * @returns void
     */
    resetPresentationState: (newPresentationState?: Partial<IPresentationState>) => void;

    /**
     * Function which automatically checks modified in order to saves only changed parts using appropriate APIs
     * @returns void
     */
    saveChanges: () => void;
}

// props types for the context provider
interface IPresentFeatureContextProvider extends IBaseComponent {}

// present feature context
const PresentFeature = createContext<IPresentFeatureContext | null>(null);

// initial states for slide state and presentation state
export const initPresentationState: IPresentationState = {
    identifier: "",
    name: "",
    ownerDisplayName: "",
    ownerIdentifier: "",
    slides: [],
    pace: {
        active_slide_id: "",
        counter: 0,
        mode: "",
        state: "",
    },
    totalSlides: 0,
    votingCode: {
        code: "",
        expiresAt: "",
        isValid: false,
    },
    updatedAt: "",
};

export const initSlideState: ISlideState = {
    question: "",
    description: "",
    options: [],
    selectedOption: "",
    enableVoting: true,
    showInstructionBar: true,
    fontSize: 32,
    type: "",
    config: null,
    id: "",
    createdAt: "",
    updatedAt: "",
    position: "0",
    presentationId: "",
    presentationSeriesId: "",
    questionImageUrl: "",
    questionVideoUrl: "",
    speakerNotes: "",
    result: [],
    respondents: 0,
};

interface IDataState {
    slideState: ISlideState;
    presentationState: IPresentationState;
}

export const PresentFeatureContextProvider = (props: IPresentFeatureContextProvider) => {
    const [dataState, setDataState] = useState<IDataState>({
        slideState: initSlideState,
        presentationState: initPresentationState,
    });
    const originalState = useRef<IDataState>({
        slideState: initSlideState,
        presentationState: initPresentationState,
    });

    // check modified states
    const isSlidesListModified = !_.isEqual(
        dataState.presentationState.slides,
        originalState.current.presentationState.slides
    );
    const isSlideDetailModified = !_.isEqual(dataState.slideState, originalState.current.slideState);

    // processing functions
    const changeSlideState = (newSlideState: Partial<ISlideState>) => {
        // mark as data has been changed and change data state
        setDataState((prevState) => ({
            ...prevState,
            slideState: { ...prevState.slideState, ...newSlideState },
        }));
    };

    const changePresentationState = (newPresentationState: Partial<IPresentationState>) => {
        // mark as data has been changed and change data state
        setDataState((prevState) => ({
            ...prevState,
            presentationState: { ...prevState.presentationState, ...newPresentationState },
        }));
    };

    // mark as data has not been changed
    const resetSlideState = (newSlideState?: Partial<ISlideState>) => {
        // only reset data state to the unchanged state (do not pass any argument to the function)
        if (newSlideState == null) {
            setDataState((prevState) => {
                originalState.current = _.cloneDeep(prevState);

                return { ...prevState };
            });
            return;
        }

        setDataState((prevState) => {
            originalState.current = _.cloneDeep({
                ...prevState,
                slideState: { ...prevState.slideState, ...newSlideState },
            });

            return {
                ...prevState,
                slideState: { ...prevState.slideState, ...newSlideState },
            };
        });
    };

    const resetPresentationState = (newPresentationState?: Partial<IPresentationState>) => {
        // only reset data state to the unchanged state (do not pass any argument to the function)
        if (newPresentationState == null) {
            setDataState((prevState) => {
                originalState.current = _.cloneDeep(prevState);

                return { ...prevState };
            });
            return;
        }

        setDataState((prevState) => {
            originalState.current = _.cloneDeep({
                ...prevState,
                presentationState: { ...prevState.presentationState, ...newPresentationState },
            });

            return {
                ...prevState,
                presentationState: { ...prevState.presentationState, ...newPresentationState },
            };
        });
    };

    // api-related functions
    const handleSaveSlideChanges = async (promise: Promise<IBaseResponse<any>>) => {
        if (!promise) return;

        try {
            const slideRes = await promise;

            if (slideRes.code === 200) {
                Notification.notifySuccess(SUCCESS_NOTIFICATION.SAVED_SUCCESS);
                resetSlideState();
                return;
            }

            throw new Error("Unhandled error code");
        } catch (error: any) {
            const slideRes = error?.response?.data;

            if (slideRes.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                return;
            }

            if (slideRes.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE);
                return;
            }

            if (slideRes.code === RESPONSE_CODE.PRESENTING_PRESENTATION) {
                Notification.notifyError(ERROR_NOTIFICATION.PRESENTING_PRESENTATION);
                return;
            }

            if (slideRes.code === RESPONSE_CODE.CANNOT_EDIT_VOTED_SLIDE) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_EDIT_VOTED_SLIDE);
                return;
            }

            if (slideRes.code === RESPONSE_CODE.VALIDATION_ERROR) {
                Notification.notifyError(ERROR_NOTIFICATION.VALIDATION_ERROR);
                return;
            }

            console.error("PresentationFeatureContextProvider:", error);
            Notification.notifyError(ERROR_NOTIFICATION.SAVE_PROCESS);
        }
    };

    const handleSaveSlidesListChanges = async (promise: Promise<IBaseResponse<any>>) => {
        if (!promise) return;

        // TODO: handle save slides list api response
        console.log(promise);
    };

    // this function has to be at the bottom of the 'api-related functions' section
    // function to check and save only changed parts
    const handleSaveAppropriateChanges = () => {
        if (isSlideDetailModified) {
            const mappedSlideDetail = DataMappingUtil.mapSlideDetailToPut(
                dataState.presentationState,
                dataState.slideState
            );

            const promise = SlideService.putSlideDetailAsync(
                dataState.presentationState.identifier,
                dataState.slideState.id,
                mappedSlideDetail
            );

            handleSaveSlideChanges(promise);
        }

        if (isSlidesListModified) {
            const promise = new Promise<IBaseResponse<any>>((resolve, reject) =>
                resolve({ code: 200, message: "Placeholder" } as IBaseResponse<any>)
            );

            handleSaveSlidesListChanges(promise);
        }
    };

    return (
        <PresentFeature.Provider
            value={{
                slideState: dataState.slideState,
                presentationState: dataState.presentationState,
                changeSlideState,
                changePresentationState,
                resetSlideState,
                resetPresentationState,
                saveChanges: handleSaveAppropriateChanges,
                isModifiedDetail: {
                    isSlidesListModified: isSlidesListModified,
                    isSlideDetailModified: isSlideDetailModified,
                },
                isModified: isSlidesListModified || isSlideDetailModified,
            }}
        >
            {props.children}
        </PresentFeature.Provider>
    );
};

// hook to be used in children components
export const usePresentFeature = () => {
    const presentFeature = useContext(PresentFeature);

    if (presentFeature === undefined || presentFeature === null) {
        throw new Error("There is no present feature context existing");
    }
    return presentFeature;
};
