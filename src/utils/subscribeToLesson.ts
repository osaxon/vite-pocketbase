/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExtendedRoute } from "./modifyApiUrl";
import { pb } from "@/lib/pocketbase";

export const subscribeToLesson = async ({
    userId,
    lessonId,
}: {
    userId: string;
    lessonId: string;
}) => {
    console.log(userId, lessonId);
    const url = createExtendedRoute("/api/ext/lessons/:lesson/subscribe", {
        lesson: lessonId,
    });
    await pb.send(url, {
        method: "POST",
    });
};

export const useSubscribeToLesson = (queryClient: QueryClient) =>
    useMutation({
        mutationFn: ({
            userId,
            lessonId,
        }: {
            userId: string;
            lessonId: string;
        }) => subscribeToLesson({ userId, lessonId }),
        mutationKey: ["subscribeToLesson"],
        onSettled: async (_data, _error, variables) => {
            return await queryClient.invalidateQueries({
                queryKey: ["lessons", variables.userId],
            });
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
