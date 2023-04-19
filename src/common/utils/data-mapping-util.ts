import {
    IPresentationPace,
    IPresentationSlide,
    IPresentationState,
    ISlideState,
    initPresentationState,
} from "../contexts/present-feature-context";
import {
    ICreateNewSlideResponse,
    IOptionsResponse,
    IPresentationDetailResponse,
    ISlideDetailResponse,
    TExtraConfigs,
} from "../interfaces";

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
        let slideConfig: TExtraConfigs = {};
        try {
            slideConfig = JSON.parse(data?.extrasConfig);
        } catch (err) {
            console.error("DataMappingUtil:", err);
        }
        return {
            ...slideState,
            question: data?.question ?? "",
            description: data?.questionDescription ?? "",
            type: data?.slideType ?? "",
            respondents: data?.respondents ?? 0,
            options: (data?.options as unknown as IOptionsResponse[]) ?? [],
            result: (data?.result as unknown as { key: string; value: number }[]) ?? [],
            enableVoting: data?.isActive ?? true,
            showInstructionBar: !data?.hideInstructionBar ?? true,
            fontSize: data?.textSize ?? 32,
            id: data?.id.toString() ?? "",
            presentationId: data?.presentationId.toString() ?? "",
            presentationSeriesId: data?.presentationIdentifier ?? "",
            position: data?.position.toString() ?? "",
            createdAt: data?.createdAt ?? "",
            config: slideConfig,
            updatedAt: data?.updatedAt ?? "",
            questionImageUrl: data?.questionImageUrl ?? "",
            questionVideoUrl: data?.questionVideoEmbedUrl ?? "",
        };
    }

    static mapSlideDetailToPut(presentationState: IPresentationState, slideState: ISlideState) {
        const mappedChoices = slideState.options.map((item) => {
            let itemId = item.key;
            if (itemId.toString().split("new-").length > 1) itemId = "0";
            const mappedItem = {
                id: itemId,
                label: item.value,
                type: item.type,
                isCorrectAnswer: item.key === slideState.selectedOption,
                metadata: item.metadata,
                position: item.position,
            };
            return mappedItem;
        });

        return {
            presentationId: slideState.presentationId,
            presentationIdentifier: presentationState.identifier,
            question: slideState.question,
            questionDescription: slideState.description,
            questionImageUrl: slideState.questionImageUrl || null,
            questionVideoEmbedUrl: slideState.questionVideoUrl || null,
            slideType: slideState.type,
            speakerNotes: slideState.speakerNotes,
            isActive: slideState.enableVoting,
            showResult: true,
            hideInstructionBar: !slideState.showInstructionBar,
            extrasConfig: slideState.config,
            textSize: slideState.fontSize,
            choices: mappedChoices,
        };
    }
}
