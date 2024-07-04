import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App tests", () => {
    it("should do...", () => {
        render(<App />);

        expect(
            screen.getByRole("heading", {
                level: 1,
            })
        ).toMatch("hello");
    });
});
