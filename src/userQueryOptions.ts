/* eslint-disable @typescript-eslint/no-unused-vars */
import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import {
    TypedPocketBase,
    UserLessonsRecord,
    UserModulesRecord,
    UsersResponse,
} from "./types/pocketbase-types";
import { createExtendedRoute } from "./utils/modifyApiUrl";

async function getUserDashboardData(userId: string) {
    // const res = await pb.collection("users").getOne<
    //     UsersResponse<{
    //         user_lessons_via_user: UserLessonsRecord[];
    //         user_modules_via_user: UserModulesRecord[];
    //     }>
    // >(userId, {
    //     expand: "user_lessons_via_user,user_modules_via_user",
    // });
    const url = createExtendedRoute("/api/ext/users/:user/dashboard", {
        user: userId,
    });
    const res = await pb.send(url, {
        method: "GET",
    });
    // const { avatar, email, expand, name, username, id } = res;
    // const user_lessons = expand?.user_lessons_via_user;
    // const user_modules = expand?.user_modules_via_user;

    return res;
}

export const userQueryOptions = (userId: string) =>
    queryOptions({
        queryKey: ["user", userId],
        queryFn: () => getUserDashboardData(userId),
    });

export const userRecordQueryOptions = (userId: string, pb: TypedPocketBase) =>
    queryOptions({
        queryKey: ["user", "record", userId],
        queryFn: async () => {
            const user = await pb.collection("users").getOne(userId);
            console.log(user);
            const avatar = await pb.files.getUrl(user, user.avatar);
            console.log(avatar, "full url");

            return {
                ...user,
                avatar,
            };
        },
    });
