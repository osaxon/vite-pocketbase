/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { pb } from "@/lib/pocketbase";

export const completeModule = async ({ moduleId }: { moduleId: string }) => {
    await pb.collection("user_modules").update(moduleId, { completed: true });
};

export const useCompleteModule = (queryClient: QueryClient) =>
    useMutation({
        mutationFn: ({ moduleId }: { userId: string; moduleId: string }) =>
            completeModule({ moduleId }),
        mutationKey: ["completeModule"],
        onSettled: async (_data, _error, variables) => {
            return await queryClient.invalidateQueries({
                queryKey: ["modules", variables.userId],
            });
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
