import { HttpService } from "./http-service";
import queryString from "query-string";
// import { ISlideDetailResponse } from "../common/interfaces";

// pace action that is used to call update pace API
type PRESENTATION_PACE_ACTIONS = "present" | "quit" | "change_slide";

const mockData = {
    presentationDetail: {
        code: 200,
        message: "OK",
        data: {
            createdAt: "2023-02-17T10:06:47.145Z",
            updatedAt: "2023-03-03T06:48:35.633Z",
            id: 10,
            name: "demo",
            seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
            voteKey: "tKiHYGEAqiZbvuopGPY3X",
            votingCode: "12345678",
            ownerId: 17,
            ownerDisplayName: "Hung Nguyen Hua",
            pace: {
                mode: "presenter",
                active: "SsIibypcSLJGwVOgO7eCf",
                state: "presenting",
                counter: 1,
                scope: "public",
                groupId: null,
            },
            closedForVoting: false,
            slideCount: 9,
            slides: [
                { id: 24, admin_key: "SsIibypcSLJGwVOgO7eCf", type: "multiple_choice", position: 1 },
                { id: 25, admin_key: "Kg3cwtJP-tp2R54apMfH8", type: "multiple_choice", position: 2 },
                { id: 26, admin_key: "-B9XUboB9t8ycw0Og35oo", type: "multiple_choice", position: 3 },
                { id: 35, admin_key: "Hj_7YOUTHGRJBmrCYYJ7O", type: "multiple_choice", position: 4 },
            ],
            permission: { presentationRole: "owner", groupRole: null },
        },
        metadata: { createdDate: "2023-03-15T10:22:18.242Z" },
    },
    slideDetail: {
        code: 200,
        message: "OK",
        data: {
            createdAt: "2023-02-17T10:06:47.293Z",
            updatedAt: "2023-02-17T10:06:47.293Z",
            id: "24",
            adminKey: "SsIibypcSLJGwVOgO7eCf",
            presentationId: "10",
            presentationSeriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
            question: "",
            questionDescription: "",
            questionImageUrl: null,
            questionVideoUrl: null,
            type: "multiple_choice",
            active: true,
            hideInstructionBar: false,
            speakerNotes: null,
            choices: [
                { id: "0", label: "Lựa chọn 1", position: 0, correctAnswer: false },
                { id: "1", label: "Lựa chọn 2", position: 1, correctAnswer: false },
                { id: "2", label: "Lựa chọn 3", position: 2, correctAnswer: false },
            ],
            config: null,
            position: "0",
            textSize: 32,
        },
        metadata: { createdDate: "2023-03-15T10:22:18.878Z" },
    },
    slideResult: {
        code: 200,
        message: "OK",
        data: {
            slideId: "24",
            slideAdminKey: "SsIibypcSLJGwVOgO7eCf",
            respondents: 1,
            results: [
                { id: "0", label: "Lựa chọn 1", score: [1] },
                { id: "1", label: "Lựa chọn 2", score: [2] },
                { id: "2", label: "Lựa chọn 3", score: [4] },
            ],
        },
        metadata: { createdDate: "2023-03-15T10:22:19.335Z" },
    },
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
};

// TODO: change mock data to API when having real API
export default class PresentationService {
    static getPresentationListAsync(filter: { page: number; limit: number }) {
        return HttpService.get(`/v1/presentations?${queryString.stringify(filter)}`);
    }

    static createPresentationAsync(data: { name: string }) {
        return HttpService.post("/v1/presentations", data);
    }

    static updatePresentationAsync(id: string, data: { name: string }) {
        return HttpService.put(`/v1/presentations/${id}`, data);
    }

    static deletePresentationAsync(id: string) {
        return HttpService.delete(`/v1/presentations/${id}`);
    }

    static getPresentationDetailAsync(seriesId: string) {
        // return HttpService.get(`/v1/presentations/${seriesId}`);
        return Promise.resolve(mockData.presentationDetail);
    }

    static getSlideDetailAsync(presentationId: string, slideId: string) {
        // return HttpService.get<ISlideDetailResponse>(`/v1/presentations/${presentationId}/slides/${slideId}`);
        return Promise.resolve(mockData.slideDetail);
    }

    static getSlideResultAsync(presentationId: string, slideId: string) {
        // return HttpService.get<any>(`/v1/presentations/${presentationId}/slides/${slideId}/result`);
        return Promise.resolve(mockData.slideResult);
    }

    static updatePresentationPaceAsync(
        presentationId: string,
        slideId: string,
        action: PRESENTATION_PACE_ACTIONS,
        data: any = {}
    ) {
        // return HttpService.post(`/v1/presentations/${presentationId}`, {
        //     ...data,
        //     action,
        //     admin_key: slideId === "" ? undefined : slideId,
        // });
        return Promise.resolve("OK");
    }
}
