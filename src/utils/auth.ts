/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { RecordAuthResponse } from "pocketbase";
import {
    TypedPocketBase,
    UsersRecord,
    UsersResponse,
} from "@/types/pocketbase-types";
import { MyRouter } from "@/App";
import { toast } from "sonner";

export const loginError = {
    type: "manual",
    message: "Invalid username or password!",
};

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const useLogin = (router: MyRouter, pb: TypedPocketBase) =>
    useMutation({
        mutationFn: async (
            formData: z.infer<typeof loginSchema>
        ): Promise<RecordAuthResponse<UsersResponse<UsersRecord>>> => {
            return pb
                .collection("users")
                .authWithPassword(formData.email, formData.password);
        },
        mutationKey: ["login"],
        onSuccess: (data) => {
            if (data.token) {
                toast.success("Logged in successfully");
                router.navigate({
                    to: "/dashboard/$userId",
                    params: {
                        userId: data.record.id,
                    },
                });
            }
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
