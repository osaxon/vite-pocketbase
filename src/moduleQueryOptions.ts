import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import { ModulesRecord, ModulesResponse } from "./types/pocketbase-types";

export const moduleQueryOptions = (moduleId: string) =>
    queryOptions({
        queryKey: ["modules", moduleId],
        queryFn: async () => {
            console.log("moduleId", moduleId);
            return pb
                .collection<ModulesResponse<ModulesRecord>>("modules")
                .getOne(moduleId, { expand: "lessons_via_modules.lessons.id" });
        },
    });
