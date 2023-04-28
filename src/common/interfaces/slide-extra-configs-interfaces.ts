export interface IBaseSlideExtraConfigs {}

export interface IMultipleChoiceExtraConfigs extends IBaseSlideExtraConfigs {
    enableMultipleAnswers: boolean;
}

export interface IHeadingExtraConfigs extends IBaseSlideExtraConfigs {}

export interface IParagraphExtraConfigs extends IBaseSlideExtraConfigs {}

export type TExtraConfigs = IMultipleChoiceExtraConfigs | IHeadingExtraConfigs | IParagraphExtraConfigs;
