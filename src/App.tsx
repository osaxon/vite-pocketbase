import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";
import { usePocketbase } from "./context/usePocketbase";
import "./index.css";
import { pb } from "./lib/pocketbase";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
        queryClient,
        token: "",
        user: undefined,
        pb: pb,
    },
    defaultNotFoundComponent: () => {
        return (
            <div>
                Not found
                <Link to="/">Home</Link>
            </div>
        );
    },
});

export type MyRouter = typeof router;

declare module "@tanstack/react-router" {
    interface Register {
        router: MyRouter;
    }
}

export default function App() {
    const { user, token, pb } = usePocketbase();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider
                router={router}
                context={{
                    user,
                    token,
                    queryClient,
                    pb,
                }}
            />
        </QueryClientProvider>
    );
}
