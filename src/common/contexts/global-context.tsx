import { createContext, useContext, useState } from "react";
import { Stack } from "react-bootstrap";
import { GlobalBlockUI } from "../components/block-ui";
import { Loading } from "../components/loading";

export interface IGlobalContextState {
    isBlocking: boolean;
    blockMessage: string;
    isTransparent: boolean;
}

export interface IGlobalContext {
    state: IGlobalContextState;
    blockUI: (msg?: string, isTransparent?: boolean) => void;
    unBlockUI: () => void;
}

// define default value
const initialGlobalState = {
    isBlocking: false,
    blockMessage: "Hệ thống đang xử lý, vui lòng đợi trong giây lát ...",
    isTransparent: false,
};

export const GlobalContext = createContext<IGlobalContext>({
    state: initialGlobalState,
    blockUI: (msg?: string, isTransparent?: boolean) => {},
    unBlockUI: () => {},
});

export const GlobalContextProvider = ({ children }: { children: JSX.Element }) => {
    const [globalState, setGlobalState] = useState<IGlobalContextState>(initialGlobalState);

    const blockUI = (msg?: string, isTransparent: boolean = false) => {
        setGlobalState({
            ...globalState,
            blockMessage: msg || initialGlobalState.blockMessage,
            isBlocking: true,
            isTransparent: isTransparent,
        });
    };

    const unBlockUI = () => {
        setGlobalState({
            ...globalState,
            blockMessage: initialGlobalState.blockMessage,
            isBlocking: false,
            isTransparent: false,
        });
    };

    return (
        <GlobalContext.Provider value={{ state: globalState, blockUI, unBlockUI }}>
            {children}
            {globalState.isBlocking && (
                <GlobalBlockUI isTransparent={globalState.isTransparent}>
                    <Stack className="w-100 h-100">
                        {globalState.isTransparent ? null : (
                            <Loading message={globalState.blockMessage} color={"primary"} />
                        )}
                    </Stack>
                </GlobalBlockUI>
            )}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const globalContext = useContext(GlobalContext);

    if (globalContext === undefined) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }

    return globalContext;
};
