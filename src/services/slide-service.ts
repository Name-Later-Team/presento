import { ICreateNewSlideResponse, ISlideDetailResponse } from "../common/interfaces";
import { SlideType } from "../features/presentation-detail/components/presentation-slide";
import { HttpService } from "./http-service";

const mockData = {
    newSlide: {
        code: 201,
        message: "Created",
        data: {
            adminKey: "vHcBbannjx_VeLG7INacs",
            presentationId: "10",
            presentationSeriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
            question: "",
            type: "multiple_choice",
            choices: [
                { id: "0", label: "Lựa chọn 1", position: "0", correctAnswer: false },
                { id: "1", label: "Lựa chọn 2", position: "1", correctAnswer: false },
                { id: "2", label: "Lựa chọn 3", position: "2", correctAnswer: false },
            ],
            position: "4",
            questionImageUrl: null,
            questionVideoUrl: null,
            speakerNotes: null,
            config: null,
            createdAt: "2023-03-15T16:01:22.013Z",
            updatedAt: "2023-03-15T16:01:22.013Z",
            id: "41",
            questionDescription: "",
            active: true,
            hideInstructionBar: false,
            textSize: 32,
        },
        metadata: { createdDate: "2023-03-15T16:01:22.180Z" },
    },
    deleteSlide: { code: 200, message: "OK", metadata: { createdDate: "2023-03-15T16:25:57.739Z" } },
    slideDetail: {
        code: 200,
        message: "OK",
        data: {
            id: 53,
            createdAt: "2023-04-01T10:53:19.794Z",
            updatedAt: "2023-04-01T10:53:19.794Z",
            presentationId: 53,
            presentationIdentifier: "9e3c1073-4037-4670-8486-af7f1cdf9a71",
            question: "Default question",
            questionDescription: null,
            questionImageUrl: null,
            questionVideoEmbedUrl: null,
            slideType: "multiple_choice",
            speakerNotes: null,
            isActive: true,
            showResult: true,
            hideInstructionBar: false,
            extrasConfig: null,
            position: 0,
            respondents: 0,
            selectedOption: "",
            options: [
                {
                    key: 53,
                    value: "Lựa chọn 1",
                    type: "option",
                    position: 0,
                    metadata: null,
                },
            ],
            result: [
                {
                    key: 53,
                    value: 0,
                },
            ],
        },
    },
};

export default class SlideService {
    static createSlideAsync(identifier: string, data: { type: SlideType }) {
        return HttpService.post<ICreateNewSlideResponse>(
            `/api/presentation/v1/presentations/${identifier}/slides`,
            data
        );
    }

    static deleteSlideAsync(seriesId: string, adminKey: string) {
        // return HttpService.delete<any>(`/v1/presentations/${seriesId}/slides/${adminKey}`);
        return Promise.resolve(mockData.deleteSlide);
    }

    static getSlideDetailAsync(presentationIdentifier: string, slideId: string) {
        return HttpService.get<ISlideDetailResponse>(
            `/api/presentation/v1/presentations/${presentationIdentifier}/slides/${slideId}`
        );
    }

    static putSlideDetailAsync(presentationIdentifier: string, slideId: string, data: any) {
        return HttpService.put<any>(
            `/api/presentation/v1/presentations/${presentationIdentifier}/slides/${slideId}`,
            data
        );
    }
}
