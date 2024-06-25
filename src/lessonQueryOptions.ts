import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import { LessonsRecord, LessonsResponse } from "./types/pocketbase-types";

export const lessonQueryOptions = (lessonId: string) =>
    queryOptions({
        queryKey: ["lessons", lessonId],
        queryFn: () => {
            return pb
                .collection("lessons")
                .getOne<LessonsResponse<LessonsRecord>>(lessonId);
        },
    });
