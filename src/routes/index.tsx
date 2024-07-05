import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Home,
});

export function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to your new app!</p>
            <button>Button</button>
        </div>
    );
}
