import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserLessonForDashboard } from "@/types/types";
import { dashboardQueryOptions } from "@/utils/useDashboardQuery";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    Link,
    createFileRoute,
    notFound,
    redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$userId")({
    beforeLoad: async ({ context }) => {
        if (!context.token) {
            throw redirect({
                to: "/sign-in",
                search: {
                    redirect: "/lessons",
                },
            });
        }
    },
    loader: async ({ context: { queryClient, user } }) => {
        const dashboardData = await queryClient.ensureQueryData(
            dashboardQueryOptions(user?.id)
        );
        if (!dashboardData) {
            console.log("not found");
            throw notFound();
        }

        return { dashboardData };
    },
    component: DashboardComponent,
});

function DashboardComponent() {
    const context = Route.useRouteContext();
    const userId = context.user?.id;
    const { data: dashboardData } = useSuspenseQuery(
        dashboardQueryOptions(userId)
    );

    const { lessons } = dashboardData;

    return (
        <div className="grid grid-cols-6 gap-4 @container">
            <div className="col-span-1"></div>
            <ul className="col-span-5 grid @5xl:grid-cols-3 @4xl:grid-cols-2 grid-cols-1 p-6 gap-6 ">
                {lessons.map((lesson) => (
                    <li key={lesson.id}>
                        <LessonCard lesson={lesson} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function LessonCard({ lesson }: { lesson: UserLessonForDashboard }) {
    return (
        <Card className="bg-white ">
            <CardHeader>
                <CardTitle>{lesson.name}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-20">
                {lesson.name}
                <Progress
                    //
                    value={lesson.percentComplete}
                    className="w-[60%]"
                />
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button>
                    <Link
                        to="/lessons/$lessonId"
                        params={{ lessonId: lesson.lessonId }}
                    >
                        Continue
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
