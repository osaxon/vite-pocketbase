import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pocketbase";
import { UsersRecord } from "@/types/pocketbase-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { RecordAuthResponse } from "pocketbase";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

    const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
        // TODO add client side validation and submission
        console.log(formData);
        const res = await pb
            .collection("users")
            .authWithPassword<
                RecordAuthResponse<UsersRecord>
            >(formData.email, formData.password);
        if (res.token) {
            toast.success("Logged in successfully");
            router.invalidate();
        }
    };

    useLayoutEffect(() => {
        if (isValid && search.redirect) {
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
