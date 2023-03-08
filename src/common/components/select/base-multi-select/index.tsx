import Select, { GroupBase, Props, StylesConfig } from "react-select";
import { baseColor, stateColor } from "../variables";

export function BaseMultiSelect<
    Option extends { isFixed: boolean },
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
    const customStyles: StylesConfig<Option, IsMulti, Group> = {
        option: (provided, state) => ({
            ...provided,
            ...(props.styles?.option && props.styles.option(provided, state)),
            color: state.isSelected ? baseColor.white : baseColor.text,
            padding: "0.4375rem 0.875rem",
            backgroundColor: state.isSelected ? baseColor.primary : baseColor.white,
            ":hover": {
                backgroundColor: state.isSelected ? baseColor.primary : stateColor.primary,
            },
            fontSize: "0.9375rem",
            cursor: "pointer",
        }),
        control: (styles, state) => {
            return {
                ...styles,
                ...(props.styles?.control && props.styles.control(styles, state)),
                border: state.isFocused ? `1px solid ${baseColor.primary}` : `1px solid ${baseColor.border}`,
                boxShadow: state.isFocused ? `0 0 0.25rem 0.05rem ${stateColor.primary}` : "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                backgroundColor: state.isDisabled ? "#ECEEF1" : "#fff",
                ":hover": {
                    border: state.isFocused ? `1px solid ${baseColor.primary}` : `1px solid ${baseColor.border}`,
                },
            };
        },
        singleValue: (provided, state) => {
            const opacity = 1;
            const transition = "opacity 300ms";

            return {
                ...provided,
                ...(props.styles?.singleValue && props.styles.singleValue(provided, state)),
                opacity,
                transition,
                color: baseColor.text,
                margin: "0",
            };
        },
        placeholder: (styles, state) => ({
            ...styles,
            ...(props.styles?.placeholder && props.styles.placeholder(styles, state)),
            color: baseColor.placeholder,
        }),
        valueContainer: (styles, state) => ({
            ...styles,
            ...(props.styles?.valueContainer && props.styles.valueContainer(styles, state)),
            padding: "0.4375rem 0.875rem",
            fontSize: "0.9375rem",
        }),
        input: (styles, state) => ({
            ...styles,
            ...(props.styles?.input && props.styles.input(styles, state)),
            margin: "0",
            padding: "0",
        }),
        multiValue: (base, state) => {
            return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
        },
        multiValueLabel: (base, state) => {
            return state.data.isFixed ? { ...base, fontWeight: "bold", color: "white", paddingRight: 10 } : base;
        },
        multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: "none" } : base;
        },
    };

    return (
        <Select
            {...props}
            styles={{ ...customStyles }}
            noOptionsMessage={({ inputValue }) => <>Không có kết quả phù hợp</>}
        />
    );
}
