import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { lessonQueryOptions } from "@/lessonsQueryOptions";
import { LessonsResponse } from "@/types/pocketbase-types";
import { useSubscribeToLesson } from "@/utils/subscribeToLesson";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/")({
    beforeLoad: ({ location, context }) => {
        if (!context.pb.authStore.isValid) {
            throw redirect({
                to: "/sign-in",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    pendingComponent: () => <Spinner size="lg" />,
    loader: async ({ context: { queryClient, user } }) => {
        const { lessons, userLessons } = await queryClient.ensureQueryData(
            lessonQueryOptions({ userId: user?.id })
        );

        if (!lessons) {
            throw notFound({ throw: true });
        }

        return { lessons, userLessons };
    },
    component: LessonsComponent,
});

function LessonsComponent() {
    const context = Route.useRouteContext();
    const {
        data: { lessons, userLessons },
    } = useSuspenseQuery(lessonQueryOptions({ userId: context.user?.id }));

    const { mutate: subscribe } = useSubscribeToLesson(context.queryClient);

    const isSubscribed = (lessonId: string) =>
        userLessons?.map(({ lesson }) => lesson).includes(lessonId);

    return (
        <div className="border">
            <ul className="space-y-6">
                {lessons.items.map((lesson: LessonsResponse) => (
                    <li key={lesson.id}>
                        <LessonCard lesson={lesson}>
                            <p>
                                {lesson.name} - - {lesson.grade}
                            </p>
                            <Button
                                onClick={() =>
                                    subscribe({
                                        userId: context.user?.id,
                                        lessonId: lesson.id,
                                    })
                                }
                                disabled={isSubscribed(lesson.id)}
                            >
                                Subscribe
                            </Button>
                        </LessonCard>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LessonCard({
    children,
    lesson,
}: {
    children: React.ReactNode;
    lesson: LessonsResponse;
}) {
    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle>{lesson.name}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
