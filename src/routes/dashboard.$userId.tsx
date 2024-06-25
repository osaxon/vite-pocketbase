import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    LessonsRecord,
    LessonsResponse,
    UserLessonsRecord,
    UserLessonsResponse,
    UserModulesRecord,
    UserModulesResponse,
} from "@/types/pocketbase-types";
import {
    userLessonsQueryOptions,
    userModulesQueryOptions,
} from "@/userLessonsQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/$userId")({
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
    loader: async ({ context: { queryClient, auth } }) => {
        const userLessons = await queryClient.ensureQueryData(
            userLessonsQueryOptions(auth.model?.id)
        );

        return { userLessons };
    },
    component: DashboardComponent,
});

const extractLessonData = (
    userLessons: UserLessonsResponse<UserLessonsRecord>[]
) => {
    const lessons = userLessons.map(({ expand }) => expand?.lesson);
    return lessons as unknown as LessonsResponse<LessonsRecord>[];
};

const extractLessonModules = (
    lessonId: string,
    userModuleData: UserModulesResponse<UserModulesRecord>[]
) => {
    return userModuleData.filter(
        (item) => item.expand?.module?.lesson === lessonId
    );
};

function DashboardComponent() {
    const context = Route.useRouteContext();
    const userLessonsQuery = useSuspenseQuery(
        userLessonsQueryOptions(context.auth.model?.id)
    );
    const userModulesQuery = useSuspenseQuery(
        userModulesQueryOptions(context.auth.model?.id)
    );

    const {
        data: { items },
    } = userLessonsQuery;
    const userLessonData = extractLessonData(items);

    const {
        data: { items: userModuleData },
    } = userModulesQuery;

    console.log(userModuleData, "<--- modules data");

    return (
        <div className="grid grid-cols-6 gap-4 @container">
            <div className="col-span-1"></div>
            <ul className="col-span-5 grid @5xl:grid-cols-3 @4xl:grid-cols-2 grid-cols-1 p-6 gap-6 ">
                {userLessonData.map((lesson) => (
                    <li key={lesson?.id}>
                        <LessonCard
                            lesson={lesson}
                            modules={extractLessonModules(
                                lesson.id,
                                userModuleData
                            )}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LessonCard({
    lesson,
    modules,
}: {
    lesson: LessonsResponse<LessonsRecord>;
    modules: UserModulesResponse<UserModulesRecord>[];
}) {
    console.log(modules, "<<<<<< user_modules");
    const completed = modules.filter((item) => item.completed === true);
    return (
        <Card className="bg-white ">
            <CardHeader>
                <CardTitle>{lesson.name}</CardTitle>
            </CardHeader>
            <CardContent className="min-h-20">
                {lesson.description}
                <Progress
                    //
                    value={(completed.length / modules.length) * 100}
                    className="w-[60%]"
                />
                {completed.length} / {modules.length}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button>Continue</Button>
            </CardFooter>
        </Card>
    );
}
