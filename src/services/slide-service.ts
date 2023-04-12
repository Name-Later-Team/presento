import { ICreateNewSlideResponse, ISlideDetailResponse } from "../common/interfaces";
import { SlideType } from "../features/presentation-detail/components/presentation-slide";
import { HttpService } from "./http-service";

export default class SlideService {
    static createSlideAsync(identifier: string, data: { type: SlideType }) {
        return HttpService.post<ICreateNewSlideResponse>(
            `/api/presentation/v1/presentations/${identifier}/slides`,
            data
        );
    }

    static deleteSlideAsync(presentationIdentifier: string, slideId: string) {
        return HttpService.delete<any>(
            `/api/presentation/v1/presentations/${presentationIdentifier}/slides/${slideId}`
        );
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
