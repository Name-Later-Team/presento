import { createContext, useContext, useState } from "react";
import { IBaseComponent } from "../interfaces";

// interfaces
export interface ISlideState {
    question: string;
    description: string;
    options: { key: string; value: string }[];
    selectedOption: string; // contains the key of the correct option in options field
    enableVoting: boolean;
    showInstructionBar: boolean;
    fontSize: number;
    type: string;
    adminKey: string;
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
    adminKey: string;
    type: string;
    position: number;
}

export interface IPresentationPace {
    active: string;
    counter: number;
    mode: string;
    state: "idle" | "presenting" | "";
    groupId: string | null;
}

export interface IPresentationState {
    id: string;
    name: string;
    ownerDisplayName: string;
    ownerId: string;
    slides: IPresentationSlide[];
    pace: IPresentationPace;
    slideCount: number;
    voteKey: string;
    votingCode: string;
}

interface IPresentFeatureContext {
    // state to indicate that data has been changed or not
    isModified: boolean;

    // access and change state that has information relating to a slide
    slideState: ISlideState;
    changeSlideState: (newSlideState: ISlideState) => void;
    resetSlideState: (newSlideState?: ISlideState) => void;

    // access and change state that has information relating to a presentation
    presentationState: IPresentationState;
    changePresentationState: (newPresentationState: IPresentationState) => void;
    resetPresentationState: (newPresentationState?: IPresentationState) => void;
}

// props types for the context provider
interface IPresentFeatureContextProvider extends IBaseComponent {}

// present feature context
const PresentFeature = createContext<IPresentFeatureContext | null>(null);

// initial states for slide state and presentation state
export const initPresentationState: IPresentationState = {
    id: "",
    name: "",
    ownerDisplayName: "",
    ownerId: "",
    slides: [],
    pace: {
        active: "",
        counter: 0,
        mode: "",
        state: "",
        groupId: null,
    },
    slideCount: 0,
    voteKey: "",
    votingCode: "",
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
    adminKey: "",
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
    isModified: boolean;
}

export const PresentFeatureContextProvider = (props: IPresentFeatureContextProvider) => {
    // const [slideState, setSlideState] = useState<ISlideState>(initSlideState);
    // const [presentationState, setPresentationState] = useState<IPresentationState>(initPresentationState);
    // const isModified = useRef(false);
    const [dataState, setDataState] = useState<IDataState>({
        slideState: initSlideState,
        presentationState: initPresentationState,
        isModified: false,
    });

    const changeSlideState = (newSlideState: ISlideState) => {
        // mark as data has been changed and change data state
        setDataState((prevState) => ({
            ...prevState,
            slideState: { ...dataState.slideState, ...newSlideState },
            isModified: true,
        }));
    };

    const changePresentationState = (newPresentationState: IPresentationState) => {
        // mark as data has been changed and change data state
        setDataState((prevState) => ({
            ...prevState,
            presentationState: { ...dataState.presentationState, ...newPresentationState },
            isModified: true,
        }));
    };

    // mark as data has not been changed
    const resetSlideState = (newSlideState?: ISlideState) => {
        // only reset data state to the unchanged state (do not pass any argument to the function)
        if (newSlideState == null) {
            setDataState((prevState) => ({
                ...prevState,
                isModified: false,
            }));
            return;
        }

        setDataState((prevState) => ({
            ...prevState,
            slideState: { ...dataState.slideState, ...newSlideState },
            isModified: false,
        }));
    };

    const resetPresentationState = (newPresentationState?: IPresentationState) => {
        // only reset data state to the unchanged state (do not pass any argument to the function)
        if (newPresentationState == null) {
            setDataState((prevState) => ({
                ...prevState,
                isModified: false,
            }));
            return;
        }

        setDataState((prevState) => ({
            ...prevState,
            presentationState: { ...dataState.presentationState, ...newPresentationState },
            isModified: false,
        }));
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
                isModified: dataState.isModified,
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
