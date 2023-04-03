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

export interface ISlideDetailResponse {
    question: string;
    questionDescription: string;
    isActive: boolean;
    hideInstructionBar: boolean;
    textSize: number;
    slideType: string;
    extrasConfig: any;
    createdAt: string;
    updatedAt: string;
    questionImageUrl: string | null;
    questionVideoEmbedUrl: string | null;
    speakerNotes: string;
    id: string;
    position: number;
    presentationId: number;
    presentationIdentifier: string;
    options: { key: string; value: string; type: string; position: number; metadata: any }[];
    result: { key: string; value: number }[];
    respondents: number;
}
