import { lessonQueryOptions } from "@/lessonQueryOptions";
import { useCreateModule } from "@/utils/createModule";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/$lessonId")({
    loader: ({ context, params }) =>
        context.queryClient.ensureQueryData(
            lessonQueryOptions(params.lessonId)
        ),
    component: SingleLessonComponent,
});

function SingleLessonComponent() {
    const queryClient = useQueryClient();
    const lessonQuery = useSuspenseQuery(
        lessonQueryOptions(
            Route.useParams({ select: ({ lessonId }) => lessonId })
        )
    );
    const {
        mutate: createModule,
        variables,
        isPending,
    } = useCreateModule(queryClient);
    const { data } = lessonQuery;
    return (
        <div>
            <h1>Lesson</h1>
            <div>
                {isPending && <span>{variables.title}</span>}
                <button
                    onClick={() =>
                        createModule({
                            title: "new module" + Math.random().toString(),
                            lessonId: "qif04ud91lew7q1",
                        })
                    }
                >
                    create module
                </button>
            </div>

            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
