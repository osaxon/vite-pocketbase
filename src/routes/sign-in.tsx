import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pocketbase";
import { loginError, useLogin } from "@/utils/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validSearchParms = z.object({
    redirect: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const Route = createFileRoute("/sign-in")({
    validateSearch: (search) => validSearchParms.parse(search),
    beforeLoad: ({ context }) => {
        if (context.auth.isValid) {
            throw redirect({
                to: `/dashboard/$userId`,
                params: {
                    userId: context.auth.model?.id,
                },
            });
        }
    },
}).update({
    component: SignInComponent,
});

function SignInComponent() {
    const router = useRouter();
    const { isValid } = Route.useRouteContext({
        select: ({ auth }) => ({ isValid: auth.isValid }),
    });
    const search = Route.useSearch();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: login, isError } = useLogin(router);

    const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
        console.log(formData);
        login(formData);
        if (isError) {
            form.setError("password", loginError);
            form.setError("email", loginError);
        }
    };

    useLayoutEffect(() => {
        if (isValid && search.redirect) {
            console.log(isValid);
            router.history.push(search.redirect);
        }
    }, [isValid, search.redirect]);

    return (
        <div className="mx-auto max-w-xl min-h-screen">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <Button onClick={() => pb.authStore.clear()}>Sign Out</Button>
        </div>
    );
}
