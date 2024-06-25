import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import {
    LessonsRecord,
    LessonsResponse,
    LessonsGradeOptions,
} from "./types/pocketbase-types";

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
