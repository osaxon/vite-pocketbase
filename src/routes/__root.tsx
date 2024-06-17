import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    Link,
    Outlet,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
    {
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
                </div>
                <hr />
                <Outlet />
                <ReactQueryDevtools position="right" />
                <TanStackRouterDevtools position="bottom-left" />
            </>
        ),
    }
);
