import { QueryClient, queryOptions, useMutation } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import {
    LessonsRecord,
    LessonsResponse,
    LessonsGradeOptions,
} from "./types/pocketbase-types";

export const realTime = async ({
    queryKey,
    queryClient,
}: {
    queryKey: string[];
    queryClient: QueryClient;
}) => {
    const res = await pb.collection("lessons").subscribe("*", (e) => {
        console.log(e);
        console.log("real time");
        queryClient.setQueryData(queryKey, (oldData: LessonsRecord[]) => {
            oldData.unshift(e.record);
            return oldData;
        });
    });
    return res;
};

export const useRealTime = (queryClient: QueryClient, queryKey: string[]) => {
    return useMutation({
        mutationFn: () => realTime({ queryKey: queryKey, queryClient }),
    });
};

export const lessonQueryOptions = (grade?: LessonsGradeOptions) =>
    queryOptions({
        queryKey: ["lessons", grade ? grade : "all"],
        queryFn: async () => {
            if (grade) {
                console.log("grade", grade);
                return pb
                    .collection<LessonsResponse<LessonsRecord>>("lessons")
                    .getList(1, 20, {
                        filter: pb.filter("grade ~ {:grade}", { grade }),
                    });
            } else {
                return pb
                    .collection<LessonsResponse<LessonsRecord>>("lessons")
                    .getList(1, 20);
            }
        },
    });
