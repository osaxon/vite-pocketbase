import { expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";

if (matchers) {
    expect.extend(matchers);
}
