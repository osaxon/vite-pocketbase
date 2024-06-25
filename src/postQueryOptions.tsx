import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import { PostsRecord, PostsResponse } from "./types/pocketbase-types";

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const postQueryOpptions = (title?: string) =>
    queryOptions({
        queryKey: ["posts", title],
        queryFn: async () => {
            await sleep(1200);
            if (title) {
                return pb
                    .collection<PostsResponse<PostsRecord>>("posts")
                    .getList(1, 20, {
                        filter: pb.filter("title ~ {:title}", { title }),
                    });
            } else {
                return pb
                    .collection<PostsResponse<PostsRecord>>("posts")
                    .getList(1, 20);
            }
        },
    });
