import { queryOptions } from "@tanstack/react-query";
import { pb } from "./lib/pocketbase";

export const postQueryOpptions = queryOptions({
    queryKey: ["posts"],
    queryFn: () => pb.collection("posts").getFullList(),
});
