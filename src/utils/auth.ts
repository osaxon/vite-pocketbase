/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { z } from "zod";
import { RecordAuthResponse } from "pocketbase";
import { UsersRecord, UsersResponse } from "@/types/pocketbase-types";
import { MyRouter } from "@/main";
import { toast } from "sonner";

export const loginError = {
    type: "manual",
    message: "Invalid username or password!",
};

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const useLogin = (router: MyRouter) =>
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
                router.invalidate();
            }
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
