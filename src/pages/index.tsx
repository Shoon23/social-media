// const PostCard = React.lazy(() => import("@/components/Home/PostCard"));
import React, { Suspense } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { iMySession, iPost } from "@/types";
import { formatPosts } from "@/utils/postUtils";
import ErrorPrisma from "@/components/ErrorPrisma";
import PostCard from "@/components/Home/PostCard";
import Loading from "@/components/Loading";

interface Props {
  posts: iPost[];
  error: boolean;
}

const Home: React.FC<Props> = ({ posts = [], error = false }) => {
  return (
    <div className="mt-3 overflow-y-scroll h-[88vh]">
      <div className="flex flex-col items-center gap-2">
        {posts.length !== 0 ? (
          posts.map((post) => <PostCard key={post.postId} post={post} />)
        ) : (
          <div className="text-white flex h-screen place-items-center">
            {error ? <ErrorPrisma /> : <h1 className="">No Post</h1>}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, userId: true },
        },
        comments: {
          select: {
            commentId: true,
          },
        },
        userLikes: {
          select: {
            postId: true,
            userId: true,
          },
        },
      },
    });

    const postsWithLikes = posts.map((post) => ({
      ...post,
      totalLikes: post.userLikes.length,
      isLiked: post.userLikes.some((like) => like.userId === user.id),
    }));

    const formattedPosts = formatPosts(postsWithLikes);

    return {
      props: {
        posts: formattedPosts,
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
      },
    };
  }
};

export default Home;
