import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to your new app!</p>
        </div>
    );
}
