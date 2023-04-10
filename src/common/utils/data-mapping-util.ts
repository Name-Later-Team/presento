import {
    IPresentationPace,
    IPresentationSlide,
    IPresentationState,
    ISlideState,
    initPresentationState,
} from "../contexts/present-feature-context";
import { ICreateNewSlideResponse, IPresentationDetailResponse, ISlideDetailResponse } from "../interfaces";

export default class DataMappingUtil {
    static mapSlideListFromApiData(data: any): IPresentationSlide[] {
        return data.map(
            (item: any) =>
                ({
                    id: item?.id ?? "",
                    type: item?.slideType ?? "",
                    position: item?.position ?? 1,
                } as IPresentationSlide)
        );
    }

    static mapNewlyCreatedSlideData(data: ICreateNewSlideResponse): IPresentationSlide {
        return {
            id: data.id.toString() ?? "",
            type: data.slideType ?? "",
            position: data.position ?? 1,
        } as IPresentationSlide;
    }

    static mapPresentationStateFromApiData(
        presentationState: IPresentationState,
        data: IPresentationDetailResponse
    ): IPresentationState {
        const slideList = data.slides;
        const mappedSlideList: IPresentationSlide[] = this.mapSlideListFromApiData(slideList);

        return {
            ...presentationState,
            identifier: data?.identifier ?? "",
            ownerIdentifier: data?.ownerIdentifier ?? "",
            totalSlides: data?.totalSlides ?? 0,
            name: data?.name ?? "",
            ownerDisplayName: data.ownerDisplayName ?? "",
            slides: mappedSlideList,
            votingCode: initPresentationState.votingCode,
            pace: {
                active_slide_id: data?.pace?.active_slide_id.toString() ?? "",
                counter: data?.pace?.counter ?? 0,
                mode: data?.pace?.mode ?? "",
                state: data?.pace?.state ?? "",
            } as IPresentationPace,
            updatedAt: data?.updatedAt ?? "",
        };
    }

    static mapSlideStateFromApiData(slideState: ISlideState, data: ISlideDetailResponse): ISlideState {
        return {
            ...slideState,
            question: data?.question ?? "",
            description: data?.questionDescription ?? "",
            type: data?.slideType ?? "",
            respondents: data?.respondents ?? 0,
            options: (data?.options as unknown as { key: string; value: string }[]) ?? [],
            result: (data?.result as unknown as { key: string; value: number }[]) ?? [],
            enableVoting: data?.isActive ?? true,
            showInstructionBar: !data?.hideInstructionBar ?? true,
            fontSize: 32,
            id: data?.id.toString() ?? "",
            presentationId: data?.presentationId.toString() ?? "",
            presentationSeriesId: data?.presentationIdentifier ?? "",
            position: data?.position.toString() ?? "",
            createdAt: data?.createdAt ?? "",
            config: data?.extrasConfig,
            updatedAt: data?.updatedAt ?? "",
            questionImageUrl: data?.questionImageUrl ?? "",
            questionVideoUrl: data?.questionVideoEmbedUrl ?? "",
        };
    }
}
