import { Toaster } from "@/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    Link,
    Outlet,
    createRootRouteWithContext,
} from "@tanstack/react-router";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { BaseAuthStore } from "pocketbase";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    auth: BaseAuthStore;
}>()({
    component: () => (
        <>
            <div className="p-2 flex gap-2 text-lg">
                <Link
                    to="/"
                    activeProps={{
                        className: "font-bold underline",
                    }}
                >
                    home
                </Link>
                <Link
                    to="/posts"
                    activeProps={{
                        className: "font-bold underline",
                    }}
                >
                    Posts
                </Link>
                <Link to="/sign-in">Sign In</Link>
            </div>
            <hr />
            <Outlet />
            <Toaster />
            <ReactQueryDevtools position="right" />
            <TanStackRouterDevtools position="bottom-left" />
        </>
    ),
});
