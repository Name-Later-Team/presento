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
	metadata: {
		createdDate: Date;
	};
}

export interface IAccessTokenResponse {
	accessToken: string;
	expiresIn: number;
}

export interface ISlideDetailResponse {
	question: string;
	questionDescription: string;
	active: boolean;
	hideInstructionBar: boolean;
	textSize: number;
	type: string;
	adminKey: string;
	config: any;
	createdAt: string;
	updatedAt: string;
	questionImageUrl: string | null;
	questionVideoUrl: string | null;
	speakerNotes: string;
	id: string;
	position: string;
	presentationId: string;
	presentationSeriesId: string;
	choices: { id: string; label: string; position: number; correctAnswer: boolean }[];
}
