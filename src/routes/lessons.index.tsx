import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { lessonQueryOptions } from "@/lessonsQueryOptions";
import { userLessonsQueryOptions } from "@/userLessonsQueryOptions";
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
        const lessons = await queryClient.ensureQueryData(lessonQueryOptions());
        const userLessons = await queryClient.ensureQueryData(
            userLessonsQueryOptions(user?.id)
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
    const { data: lessons } = useSuspenseQuery(lessonQueryOptions());
    const { data: userLessons } = useSuspenseQuery(
        userLessonsQueryOptions(context.user?.id)
    );
    const { mutate: subscribe } = useSubscribeToLesson(context.queryClient);

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
                                    userId: context.user?.id,
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
