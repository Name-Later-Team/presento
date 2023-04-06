import { IVotingCodeResponse } from "../common/interfaces";
import { HttpService } from "./http-service";
import queryString from "query-string";

// pace action that is used to call update pace API
type PRESENTATION_PACE_ACTIONS = "present" | "quit" | "change_slide";

// TODO: change mock data to API when having real API
export default class PresentationService {
    static getPresentationListAsync(filter: { page: number; limit: number; order: { updatedAt: string } }) {
        const queries = { page: filter.page, limit: filter.limit, order: JSON.stringify(filter.order) };
        return HttpService.get<any>(`/api/presentation/v1/presentations?${queryString.stringify(queries)}`);
    }

    static createPresentationAsync(data: { name: string }) {
        return HttpService.post<any>("/api/presentation/v1/presentations", data);
    }

    static updatePresentationAsync(identifier: string, data: { name: string }) {
        return HttpService.put<any>(`/api/presentation/v1/presentations/${identifier}`, data);
    }

    static deletePresentationAsync(id: string) {
        return HttpService.delete(`/v1/presentations/${id}`);
    }

    static getPresentationDetailAsync(identifier: string) {
        return HttpService.get<any>(`/api/presentation/v1/presentations/${identifier}`);
    }

    static postVotingCodeAsync(identifier: string) {
        return HttpService.post<IVotingCodeResponse>(
            `/api/presentation/v1/presentations/${identifier}/votingCodes`,
            {}
        );
    }

    static getVotingCodeAsync(identifier: string) {
        return HttpService.get<IVotingCodeResponse>(`/api/presentation/v1/presentations/${identifier}/votingCodes`);
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
