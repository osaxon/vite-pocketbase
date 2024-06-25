import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import {
    UserLessonsResponse,
    UserLessonsRecord,
    UserModulesResponse,
    UserModulesRecord,
} from "./types/pocketbase-types";

export const userLessonsQueryOptions = (userId: string) =>
    queryOptions({
        queryKey: ["user_lessons", userId],
        queryFn: async () => {
            return pb
                .collection("user_lessons")
                .getList<UserLessonsResponse<UserLessonsRecord>>(1, 20, {
                    filter: pb.filter("user ~ {:userId}", { userId }),
                    expand: "lesson.modules",
                });
        },
    });

export const userModulesQueryOptions = (userId: string) =>
    queryOptions({
        queryKey: ["user_modules", userId],
        queryFn: async () => {
            return pb
                .collection("user_modules")
                .getList<UserModulesResponse<UserModulesRecord>>(1, 20, {
                    filter: pb.filter("user ~ {:userId}", { userId }),
                    expand: "module",
                });
        },
    });
