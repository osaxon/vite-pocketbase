import { expect, test } from "vitest";
import { createExtendedRoute, modifyUrl } from "./modifyApiUrl";

test("the base api url is modified to include /ext", () => {
    const url = `${import.meta.env.VITE_POCKET_BASE_URL}/api/lessons`;
    const result = modifyUrl(url);
    expect(result).toBe(
        `${import.meta.env.VITE_POCKET_BASE_URL}/api/ext/lessons`
    );
});

test("replaces :param with the value in the params object", () => {
    const result = createExtendedRoute("/api/ext/lessons/:lesson/subscribe", {
        lesson: "123",
    });
    expect(result).toBe("/api/ext/lessons/123/subscribe");
});
