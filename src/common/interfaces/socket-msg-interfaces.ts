export interface IChangeSlideSocketMsg {
    presentationIdentifier: string;
    pace: {
        mode: string;
        active_slide_id: number;
        state: string;
        counter: number;
    };
}

export interface IQuitSlideSocketMsg {
    presentationIdentifier: string;
}

export interface IAudienceVoteSocketMsg {
    respondents: number;
    results: Array<{
        id: number;
        label: string;
        score: Array<number>;
    }>;
    slideId: number;
}
