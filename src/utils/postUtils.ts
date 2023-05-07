import { iPost, iUser } from "@/types";
import { formatDistanceToNow } from "date-fns";

export const formatPosts = (posts: any) => {
  return posts.map((post: any) => ({
    ...post,
    createdAt: formatDistanceToNow(new Date(post.createdAt).getTime(), {
      addSuffix: true,
    }),
  }));
};
