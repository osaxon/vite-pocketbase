import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { lessonQueryOptions } from "@/lessonsQueryOptions";
import { userLessonsQueryOptions } from "@/userLessonsQueryOptions";
import { useSubscribeToLesson } from "@/utils/subscribeToLesson";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/")({
    beforeLoad: ({ location, context }) => {
        if (!context.auth.isValid) {
            throw redirect({
                to: "/sign-in",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    pendingComponent: () => <Spinner size="lg" />,
    loader: async ({ context: { queryClient, auth } }) => {
        const lessons = await queryClient.ensureQueryData(lessonQueryOptions());
        const userLessons = await queryClient.ensureQueryData(
            userLessonsQueryOptions(auth.model?.id)
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
    const lessonsQuery = useSuspenseQuery(lessonQueryOptions());
    const userLessonsQuery = useSuspenseQuery(
        userLessonsQueryOptions(context.auth.model?.id)
    );
    const { mutate: subscribe } = useSubscribeToLesson(context.queryClient);

    const { data: lessons } = lessonsQuery;
    const { data: userLessons } = userLessonsQuery;

    const isSubscribed = (lessonId: string) =>
        userLessons.items.map(({ lesson }) => lesson).includes(lessonId);

    return (
        <div>
            <ul>
                {lessons.items.map((lesson) => (
                    <li key={lesson.id}>
                        <p>
                            {lesson.name} - - {lesson.grade}
                        </p>
                        <Button
                            onClick={() =>
                                subscribe({
                                    userId: context.auth.model?.id,
                                    lessonId: lesson.id,
                                })
                            }
                            disabled={isSubscribed(lesson.id)}
                            size="icon"
                        >
                            +
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
