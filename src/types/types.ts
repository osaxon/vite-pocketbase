/* eslint-disable @typescript-eslint/no-unused-vars */
export const Routes = {
    CreateModuleWithLessonId: "/api/ext/collections/modules/records",
    SubscribeToLesson: "/api/ext/lessons/:lesson/subscribe",
} as const;


export type RouteStrings = (typeof Routes)[keyof typeof Routes];
// Utility type to extract keys from the route string
// takes param T constrained to string
type ExtractRouteParams<T extends string> =
    // check if input string has path params by checking for : followed by key
    T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? // if it does, extract the key and recurse on the rest of the string
          // and return the union of the key and the rest of the string
          Param | ExtractRouteParams<`/${Rest}`>
        : // check for param at the end of the string
          T extends `${infer _Start}:${infer Param}`
          ? Param
          : never;

export type RouteParams<T extends string> =
    ExtractRouteParams<T> extends never
        ? Record<string, never>
        : Record<ExtractRouteParams<T>, string>;

export type HasPathParams<T extends string> =
    T extends `${infer _Start}:${infer _Param}/${infer _Rest}`
        ? true
        : T extends `${infer _Start}:${infer _Param}`
          ? true
          : false;

export type RoutesWithParams = {
    [K in keyof typeof Routes]: HasPathParams<(typeof Routes)[K]> extends true
        ? (typeof Routes)[K]
        : never;
}[keyof typeof Routes];

export type RoutesWithoutParams = {
    [K in keyof typeof Routes]: HasPathParams<(typeof Routes)[K]> extends false
        ? (typeof Routes)[K]
        : never;
}[keyof typeof Routes];
