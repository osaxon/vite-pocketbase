import SvgLogo from "@/components/svg-logo";
import { Button } from "@/components/ui/button";
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
    pendingMs: 3000,
    component: RootComponent,
});

function RootComponent() {
    const context = Route.useRouteContext();

    return (
        <>
            <div className="p-2 flex gap-2 text-lg">
                {/* Show a global spinner when the router is transitioning */}
                <div className="flex items-center justify-between w-full">
                    <nav className="flex items-center gap-6">
                        <Link
                            to="/"
                            activeProps={{
                                className: "font-bold underline",
                            }}
                        >
                            <SvgLogo />
                        </Link>
                        <Link
                            to="/lessons"
                            activeProps={{
                                className: "font-bold underline",
                            }}
                        >
                            Lessons
                        </Link>
                    </nav>
                    <div>
                        {context.auth.model ? (
                            <Button asChild>
                                <Link
                                    to="/dashboard/$userId"
                                    params={{ userId: context.auth.model?.id }}
                                    activeProps={{
                                        className: "font-bold underline",
                                    }}
                                >
                                    My Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Link
                                to="/sign-in"
                                activeProps={{
                                    className: "font-bold underline",
                                }}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <hr />
            <Outlet />
            <Toaster />
            <ReactQueryDevtools position="right" />
            <TanStackRouterDevtools position="bottom-left" />
        </>
    );
}
