import React, { useEffect, useState } from "react";
import PostCard from "@/components/Home/PostCard";
import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { iComment, iMySession, iPost } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { formatPosts } from "@/utils/postUtils";
import { useInView } from "react-intersection-observer";

import {
  PaperAirplaneIcon,
  PhotoIcon,
  UserIcon,
  PencilSquareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import CommentCard from "@/components/Home/CommentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import UpdateModal from "@/components/Home/UpdateCommentModal";

interface Props {
  post: iPost & { comments: iComment[] };
}

const Post: React.FC<Props> = ({ post }) => {
  useEffect(() => {
    setComments(post.comments);
  }, []);
  const { ref, inView, entry } = useInView({});
  const [comments, setComments] = useState<iComment[]>([]);
  const [description, setDescription] = useState("");
  const session = useSession();
  const user = session.data?.user as iMySession;

  const handleAddComments = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/post/comment/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          description,
          postId: post.postId,
          userId: user.id,
        }),
      });
      const data = await res.json();

      const newComment = {
        ...data,
        createdAt: formatDistanceToNow(new Date(data.createdAt).getTime(), {
          addSuffix: true,
        }),
      };

      setComments((prev) => [...prev, newComment]);
      setDescription("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-3 overflow-y-scroll h-[88vh]">
      <div className="flex flex-col items-center gap-2">
        <PostCard post={post} />
        <div className="w-[600px] border rounded-lg p-3">
          <h1 ref={ref} className="text-xl mb-1">
            Comments
          </h1>
          {comments.map((comment: iComment) => (
            <CommentCard
              key={comment.commentId}
              comment={comment}
              setComments={setComments}
            />
          ))}
        </div>
        <form
          onSubmit={handleAddComments}
          className={`${
            inView ? "" : "hidden"
          } flex place-items-center gap-2 sticky bottom-0 m-2 w-2/4`}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea resize-none w-full"
            placeholder="Comment here"
          ></textarea>

          <button type="submit">
            <PaperAirplaneIcon className="w-10 h-10 cursor-pointer active:scale-110" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.postId as string;
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = session?.user as iMySession;
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  if (!postId) {
    return {
      props: {},
    };
  }

  try {
    const getPost = await prisma.post.findUnique({
      where: {
        postId,
      },

      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                userId: true,
              },
            },
            userLike: {
              select: {
                userId: true,
              },
            },
          },
        },
        userLikes: {
          select: {
            userId: true,
            postId: true,
          },
        },
      },
    });

    const { createdAt, comments, ...other } = getPost as any;

    const formattedPosts = comments.map((post: any) => ({
      ...post,
      createdAt: formatDistanceToNow(new Date(post.createdAt).getTime(), {
        addSuffix: true,
      }),
      isLiked: post.userLike.some((like: any) => like.userId === user.id),
      totalLikes: post.userLike.length,
    }));

    const post = {
      ...other,
      comments: formattedPosts,
      totalLikes: other.userLikes.length,
      isLiked: other.userLikes.some((like: any) => like.userId === user.id),
      createdAt: formatDistanceToNow(new Date(createdAt).getTime(), {
        addSuffix: true,
      }),
    };

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default Post;
