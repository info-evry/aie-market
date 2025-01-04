import { useEffect, useState } from "react";

interface FetchState<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

/**
 * useFetch - a custom hook to fetch data from an API with error and loading states.
 *
 * @param url The endpoint URL to fetch data from.
 * @returns { data, error, loading }
 */
export function useFetch<T = unknown>(url?: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, { signal });
                if (!response.ok) {
                    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
                }
                const jsonData = (await response.json()) as T;
                setData(jsonData);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setError(err as Error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, error, loading };
}
