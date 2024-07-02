import { pb } from "@/lib/pocketbase";
import { queryOptions } from "@tanstack/react-query";
import { createExtendedRoute } from "./modifyApiUrl";
import { DashboardData } from "@/types/types";

export const dashboardQueryOptions = (userId: string) => {
    return queryOptions({
        queryKey: ["dashboard", userId],
        queryFn: async () => {
            const url = createExtendedRoute("/api/ext/users/:user/dashboard", {
                user: userId,
            });

            const res = await pb.send<DashboardData>(url, {
                method: "GET",
            });
            return res;
        },
    });
};
