import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { postQueryOpptions } from "@/postQueryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    createFileRoute,
    notFound,
    redirect,
    useNavigate,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validSearchParms = z.object({
    title: z.string().optional(),
});

export const Route = createFileRoute("/posts")({
    validateSearch: (search) => validSearchParms.parse(search),
    loaderDeps: ({ search: { title } }) => ({ title }),
    beforeLoad: ({ location, context }) => {
        console.log("[context auth store]", context.auth);
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
    loader: async ({ context: { queryClient }, deps: { title } }) => {
        const posts = await queryClient.ensureQueryData(
            postQueryOpptions(title)
        );
        if (!posts) {
            throw notFound({ throw: true });
        }
        return { posts };
    },
    component: PostsComponent,
});

function PostsComponent() {
    const { title } = Route.useSearch();
    const postsQuery = useSuspenseQuery(postQueryOpptions(title));
    const { data } = postsQuery;

    return (
        <div>
            <p>search: {title}</p>
            <SearchForm />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

const SearchForm = () => {
    const form = useForm<z.infer<typeof validSearchParms>>({
        resolver: zodResolver(validSearchParms),
        defaultValues: {
            title: "",
        },
    });
    const navigate = useNavigate();

    const onSubmit = (data: z.infer<typeof validSearchParms>) => {
        console.log(data);
        navigate({
            search: {
                title: data.title,
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <Input placeholder="title..." {...field} />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};
