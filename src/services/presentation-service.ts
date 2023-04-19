import { IPresentationDetailResponse, IVotingCodeResponse } from "../common/interfaces";
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

    static updatePresentationAsync(
        identifier: string,
        data: Partial<{ name: string; closedForVoting: boolean; slides: Array<{ id: number; position: number }> }>
    ) {
        return HttpService.put<any>(`/api/presentation/v1/presentations/${identifier}`, data);
    }

    static deletePresentationAsync(identifier: string) {
        return HttpService.delete<any>(`/api/presentation/v1/presentations/${identifier}`);
    }

    static getPresentationDetailAsync(identifier: string) {
        return HttpService.get<IPresentationDetailResponse>(`/api/presentation/v1/presentations/${identifier}`);
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

    static resetPresentationResult(identifier: string) {
        return HttpService.post<any>(`/api/presentation/v1/presentations/${identifier}/results/reset`, {});
    }

    static updatePresentationPaceAsync(
        presentationId: string,
        slideId: string | null,
        action: PRESENTATION_PACE_ACTIONS
    ) {
        return HttpService.post<any>(`/api/presentation/v1/presentations/${presentationId}/present`, {
            slideId: slideId,
            action: action,
        });
    }
}
