import type { AppDispatch } from "../store";
import type { UnknownAction } from "@reduxjs/toolkit";

interface CachedThunkOptions<T, A extends UnknownAction> {
    cacheKey: string;
    fetcher: () => Promise<T>;
    maxAge?: number;
    onData: (data: T) => A; // A est une action Redux valide
}

export const createCachedThunk = <T, A extends UnknownAction>({
    cacheKey,
    fetcher,
    onData,
    maxAge = 24 * 60 * 60 * 1000,
}: CachedThunkOptions<T, A>) => {
    return async (dispatch: AppDispatch): Promise<void> => {
        const cached = localStorage.getItem(cacheKey);
        const now = Date.now();

        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.fetchedAt && now - new Date(parsed.fetchedAt).getTime() < maxAge) {
                dispatch(onData(parsed.data as T));
                return;
            }
        }

        const data = await fetcher();
        dispatch(onData(data));
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, fetchedAt: new Date().toISOString() })
        );
    };
};
