import { postQueryOpptions } from "@/postQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
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
