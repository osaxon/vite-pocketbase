import {
    RouteParams,
    RouteStrings,
    RoutesWithParams,
    RoutesWithoutParams,
} from "@/types/types";

export function modifyUrl(url: string): string {
    // Check if the url starts with "api/"
    const prefix = `${import.meta.env.VITE_POCKET_BASE_URL}/api/`;
    const insert = "ext/";

    const urlString = url.toString();

    if (urlString.startsWith(prefix)) {
        // Insert "ext/" after "api/"
        return urlString.replace(prefix, prefix + insert);
    }

    // If the URL does not start with "api/", return it unchanged
    return url;
}

export async function fetchExtended(
    url: URL | RequestInfo,
    config: RequestInit | undefined
): Promise<Response> {
    const newUrl = modifyUrl(url.toString());
    const res = await fetch(newUrl, config);
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json();
}

// Function signature with conditional type for params requirement
export function createExtendedRoute<T extends RoutesWithParams>(
    route: T,
    params: RouteParams<T>
): string;
export function createExtendedRoute<T extends RoutesWithoutParams>(
    route: T
): string;
export function createExtendedRoute<T extends RouteStrings>(
    route: T,
    params?: RouteParams<T>
): string {
    if (route.includes(":")) {
        // If path parameters are present but params is undefined, throw error
        if (!params) {
            throw new Error(`Parameters are required for route: ${route}`);
        }
        // Replace path parameters in route with provided params
        for (const key in params) {
            const value = params[key as keyof RouteParams<T>] as string;
            route = route.replace(`:${key}`, value) as T;
        }
    }

    return route;
}
