import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { iMySession, iPost } from "@/types";
import Loading from "../Loading";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ShowMore from "./ShowMore";
import UpdatePostModal from "./UpdatePostModal";
import toast from "react-hot-toast";

interface Props {
  post: iPost;
  userId?: string;
}

const PostCard = ({ post: postProp, userId }: Props) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as iMySession;
  const [isLiked, setIsLiked] = useState<boolean>();
  const [totalLikes, setTotalLikes] = useState<number>(postProp.totalLikes);
  const [post, setPost] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLiked(postProp.isLiked);
    setTotalLikes(postProp.totalLikes);
    setPost(postProp);
    setIsLoading(false);
  }, []);

  const handleLike = async () => {
    const res = await fetch("/api/user/post/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        isLiked,
        userId: user.id,
        postId: post.postId,
      }),
    });

    if (res.ok) {
      if (isLiked) {
        setTotalLikes((prev) => prev - 1);
      } else {
        setTotalLikes((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
    }
    if (res.status == 500) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    const publicId = post.image?.split("/")?.pop()?.split(".")[0] || "";
    const res = await fetch(
      `/api/user/post/delete?postId=${post.postId}&publicId=${publicId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      router.pathname === "/" ? router.reload() : router.push("/");
    }
    if (res.status == 500) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border border-slate-500 w-[385px] md:w-[600px] flex gap-3 flex-col bg-base-100 p-5 md:p-2 rounded-lg last:mb-14">
      {isLoading ? (
        <div className="self-center">
          <Loading />
        </div>
      ) : (
        <>
          <UpdatePostModal
            setPost={setPost}
            modalId={"updatePost"}
            post={postProp}
          />
          <div className="flex gap-2 place-items-center cursor-pointer">
            <Link
              href={`/profile/${post?.user?.userId ?? userId}`}
              className="flex gap-2 place-items-center cursor-pointer"
            >
              <div className="avatar cursor-pointer">
                <div className="w-16 rounded-full">
                  {post?.user?.avatar ? (
                    <img src={post.user.avatar} />
                  ) : (
                    <UserIcon />
                  )}
                </div>
              </div>
              <h1 className="cursor-pointer">
                {post?.user?.firstName + " " + post?.user?.lastName}
              </h1>

              <h1 className="text-slate-400">~{" " + post.createdAt}</h1>
            </Link>

            {post?.userId === user?.id && (
              <ShowMore handleDelete={handleDelete} modalId={"updatePost"} />
            )}
          </div>

          <div
            className="cursor-pointer"
            onClick={() => router.push(`/post/${post.postId}`)}
          >
            <figure>
              <img src={post.image} alt="" className="w-[600px]" />
            </figure>
            <p className="text-lg p-2">{post.description}</p>
          </div>

          <div className="flex gap-1 items-center">
            <h1>{totalLikes}</h1>
            <HeartIcon
              onClick={handleLike}
              className={`h-8 w-8 cursor-pointer hover:scale-110 transition ease-in-out delay-150 ${
                isLiked && "fill-red-500"
              }`}
            />
            <h1>{post?.comments?.length}</h1>
            <Link href={`/post/${post.postId}`}>
              <ChatBubbleLeftIcon className="w-8 h-8 cursor-pointer hover:scale-110 transition ease-in-out delay-150" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
