export interface IPaginationMetadata {
    page: number;
    pageSize: number;
    totalRecord: number;
}

export interface IBaseResponse<T> {
    code: number;
    message: string;
    data?: T;
    errors?: any;
}

export interface IAccessTokenResponse {
    accessToken: string;
    expiresIn: number;
}

export interface IOptionsResponse {
    key: string;
    value: string;
    type: string;
    position: number;
    metadata: any;
}

export interface ISlideDetailResponse {
    question: string;
    questionDescription: string;
    isActive: boolean;
    hideInstructionBar: boolean;
    textSize: number;
    slideType: string;
    extrasConfig: string;
    createdAt: string;
    updatedAt: string;
    questionImageUrl: string | null;
    questionVideoEmbedUrl: string | null;
    speakerNotes: string;
    id: string;
    position: number;
    presentationId: number;
    presentationIdentifier: string;
    options: IOptionsResponse[];
    result: { key: string; value: number }[];
    respondents: number;
}

export interface IVotingCodeResponse {
    code: string;
    isValid: boolean;
    expiresAt: string;
}

export interface ISlideListResponseData {
    id: number;
    position: number;
    slideType: string;
}

export interface IPresentationDetailResponse {
    closedForVoting: boolean;
    createdAt: string;
    identifier: string;
    name: string;
    ownerDisplayName: string;
    ownerIdentifier: string;
    pace: {
        mode: string;
        state: string;
        active_slide_id: number;
        counter: number;
    };
    slides: ISlideListResponseData[];
    totalSlides: number;
    updatedAt: string;
}

export interface ICreateNewSlideResponse {
    createdAt: string;
    extrasConfig: any;
    hideInstructionBar: boolean;
    id: number;
    isActive: boolean;
    position: number;
    presentationId: number;
    presentationIdentifier: string;
    question: string;
    questionDescription: string;
    questionImageUrl: string | null;
    questionVideoEmbedUrl: string | null;
    showResult: boolean;
    slideType: string;
    speakerNotes: string;
    textSize: number;
    updatedAt: string;
}
