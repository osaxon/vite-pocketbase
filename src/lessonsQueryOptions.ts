import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import {
    LessonsResponse,
    LessonsGradeOptions,
    LessonsRecord,
    UserLessonsRecord,
    UserLessonsResponse,
} from "./types/pocketbase-types";

export const lessonQueryOptions = ({
    grade,
    userId,
}: {
    grade?: LessonsGradeOptions;
    userId?: string;
}) =>
    queryOptions({
        queryKey: ["lessons", grade ? grade : "all"],
        queryFn: async () => {
            let lessons;
            let userLessons;
            if (grade) {
                console.log("grade", grade);
                lessons = await pb
                    .collection("lessons")
                    .getList<LessonsResponse<LessonsRecord>>(1, 20, {
                        filter: pb.filter("grade ~ {:grade}", { grade }),
                    });
            } else {
                lessons = await pb
                    .collection("lessons")
                    .getList<LessonsResponse<LessonsRecord>>(1, 20);
            }
            if (userId) {
                userLessons = await pb
                    .collection("user_lessons")
                    .getFullList<UserLessonsResponse<UserLessonsRecord>>({
                        filter: pb.filter("user ~ {:userId}", { userId }),
                    });
            }
            return {
                lessons,
                userLessons,
            };
        },
    });
