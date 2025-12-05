import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { AppState } from "@/store";

export const useGlobalState: TypedUseSelectorHook<AppState> = useSelector;
export const useAppSelector = useGlobalState;

