import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";
import { PostsRecord, PostsResponse } from "./types/pocketbase-types";

export const postQueryOpptions = (title?: string) =>
    queryOptions({
        queryKey: ["posts", title],
        queryFn: () => {
            if (title) {
                console.log("title", title);
                return pb
                    .collection<PostsResponse<PostsRecord>>("posts")
                    .getList(1, 20, {
                        filter: pb.filter("title ~ {:title}", { title }),
                    });
            } else {
                console.log("no title");
                return pb
                    .collection<PostsResponse<PostsRecord>>("posts")
                    .getList(1, 20);
            }
        },
    });
