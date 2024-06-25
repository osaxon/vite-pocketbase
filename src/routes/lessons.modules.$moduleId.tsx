import { moduleQueryOptions } from "@/moduleQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons/modules/$moduleId")({
    loader: ({ context, params }) =>
        context.queryClient.ensureQueryData(
            moduleQueryOptions(params.moduleId)
        ),
    component: SingleModuleComponent,
});

function SingleModuleComponent() {
    const moduleQuery = useSuspenseQuery(
        moduleQueryOptions(
            Route.useParams({ select: ({ moduleId: moduleId }) => moduleId })
        )
    );
    const { data } = moduleQuery;
    return (
        <div>
            <h1>Module!!!</h1>
            <pre className="text-red-500">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
