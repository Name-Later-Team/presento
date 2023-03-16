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
}

interface IPresentFeatureContext {
    // access and change state that has information relating to a slide
    slideState: ISlideState;
    changeSlideState: (newSlideState: ISlideState) => void;

    // access and change state that has information relating to a presentation
    presentationState: IPresentationState;
    changePresentationState: (newPresentationState: IPresentationState) => void;
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

export const PresentFeatureContextProvider = (props: IPresentFeatureContextProvider) => {
    const [slideState, setSlideState] = useState<ISlideState>(initSlideState);
    const [presentationState, setPresentationState] = useState<IPresentationState>(initPresentationState);

    const changeSlideState = (newSlideState: ISlideState) => {
        const tempSlideState = {
            ...slideState,
            ...newSlideState,
        };
        setSlideState(tempSlideState);
    };

    const changePresentationState = (newPresentationState: IPresentationState) => {
        const tempPresentationState = {
            ...presentationState,
            ...newPresentationState,
        };
        setPresentationState(tempPresentationState);
    };

    return (
        <PresentFeature.Provider
            value={{
                slideState,
                presentationState,
                changeSlideState,
                changePresentationState,
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
