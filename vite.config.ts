/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from "path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import "@testing-library/jest-dom/vitest";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [TanStackRouterVite(), viteReact()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/setupTests.ts"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
