import { postQueryOpptions } from "@/postQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";


export const Route = createFileRoute("/posts")({
    beforeLoad: ({ location, context }) => {
        console.log("[context auth store]", context.auth.isValid);
        if (!context.auth.isValid) {
            throw redirect({
                to: "/sign-in",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(postQueryOpptions),
    component: PostsComponent,
});

function PostsComponent() {
    const postsQuery = useSuspenseQuery(postQueryOpptions);
    const posts = postsQuery.data;

    return (
        <div>
            <pre>{JSON.stringify(posts, null, 2)}</pre>
        </div>
    );
}
