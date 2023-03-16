// import { HttpService } from "./http-service";

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
};

export default class SlideService {
    static createSlideAsync(seriesId: string, data: { type: string }) {
        // return HttpService.post<any>(`/v1/presentations/${seriesId}/slides`, data);
        return Promise.resolve(mockData.newSlide);
    }

    static deleteSlideAsync(seriesId: string, adminKey: string) {
        // return HttpService.delete<any>(`/v1/presentations/${seriesId}/slides/${adminKey}`);
        return Promise.resolve(mockData.deleteSlide);
    }
}
