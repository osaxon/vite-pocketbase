import SvgLogo from "@/components/svg-logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import type { TypedPocketBase } from "@/types/pocketbase-types";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    Link,
    Outlet,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthModel } from "pocketbase";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    token: string;
    user: AuthModel | undefined;
    pb: TypedPocketBase;
}>()({
    pendingMs: 3000,
    component: RootComponent,
    errorComponent: (data) => <>{data.error.message}</>,
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
                        {context.token ? (
                            <div className="flex items-center gap-8">
                                <Avatar>
                                    <AvatarFallback>OS</AvatarFallback>
                                </Avatar>
                                <Button asChild>
                                    <Link
                                        to="/dashboard/$userId"
                                        params={{
                                            userId: context.user?.id,
                                        }}
                                        activeProps={{
                                            className: "font-bold underline",
                                        }}
                                    >
                                        My Dashboard
                                    </Link>
                                </Button>
                            </div>
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
            <div className="min-h-screen max-w-5xl mx-auto p-4">
                <Outlet />
            </div>
            <Toaster />
            <ReactQueryDevtools position="right" />
            <TanStackRouterDevtools position="bottom-left" />
        </>
    );
}
