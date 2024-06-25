/* eslint-disable @typescript-eslint/no-unused-vars */
import { pb } from "@/lib/pocketbase";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExtendedRoute } from "./modifyApiUrl";

export const createModule = async ({
    title,
    lessonId,
}: {
    title: string;
    lessonId: string;
}) => {
    // create the new module and link to lesson
    const url = createExtendedRoute("/api/ext/collections/modules/records");
    await pb.send(url, {
        method: "POST",
        body: {
            title,
            lesson: lessonId,
        },
    });
};

export const useCreateModule = (queryClient: QueryClient) =>
    useMutation({
        mutationFn: ({
            title,
            lessonId,
        }: {
            title: string;
            lessonId: string;
        }) => createModule({ title, lessonId }),
        mutationKey: ["createModule"],
        onSettled: async () => {
            return await queryClient.invalidateQueries({
                queryKey: ["lessons"],
            });
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });
