import { Home } from "@/routes/index";
import { render, screen } from "@testing-library/react";

let container: Node | null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    screen.debug();
});

afterEach(() => {
    document.body.removeChild(container!);
    container = null;
});

describe("App tests", () => {
    it("should render the title", () => {
        render(<Home />);
        const title = screen.getByRole("heading").textContent;
        expect(title).toBe("Home");
    });
    it("should have a button", () => {
        render(<Home />);
        const button = screen.getByRole("button");
        expect(button).toBeDefined();
    });
});
