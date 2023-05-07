import React from "react";
import PostCard from "@/components/Home/PostCard";
import {
  ArrowPathIcon,
  CheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { iMySession, iPost, iUser } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { formatDistanceToNow } from "date-fns";
import { User } from "@prisma/client";
import { formatPosts } from "@/utils/postUtils";
import { useRouter } from "next/router";

interface Props {
  user: iUser;
  posts: iPost[];
  isUser: boolean;
  error: boolean;
}

const Profile: React.FC<Props> = ({
  user,
  posts = [],
  isUser = false,
  error = false,
}) => {
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };

  return (
    <div className="bg-base-100 h-[88vh] overflow-y-scroll">
      <div className="flex gap-2 flex-col items-center p-20">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="avatar">
            <div className="w-40 rounded-full">
              {user?.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <UserIcon className="" />
              )}
              {/* <img src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=5OK7djfD3cnNmQ-DR0iQzF-vmA-iTNN1TbuEyCG1DfA=" />{" "} */}
            </div>
          </div>
          <h1 className="text-4xl">{user.firstName + " " + user.lastName}</h1>
          <h1 className="text-slate-400">{user.email}</h1>
          {!isUser && (
            <>
              <button className="btn btn-info">Add Friend</button>
              <button className="btn btn-secondary">
                <CheckIcon className="w-5 h-5" /> Friend
              </button>
            </>
          )}
        </div>
        {posts.length !== 0 ? (
          posts.map((post) => <PostCard key={post.postId} post={post} />)
        ) : (
          <div className="text-white flex h-screen place-items-center">
            {error ? (
              <section className="flex flex-col place-items-center gap-2">
                <h1 className="text-red-500">Something Went Wrong</h1>
                <ArrowPathIcon
                  onClick={handleRefresh}
                  className="w-7 h-7 cursor-pointer hover:animate-spin active:scale-110 rounded-md"
                />
              </section>
            ) : (
              <h1 className="">No Post</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = context.query.userId as string;
  const sessionUser = session?.user as iMySession;

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        avatar: true,
        posts: {
          include: {
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            userLikes: {
              select: {
                postId: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    const { posts, ...userDetails } = user as any;

    const formattedPosts = formatPosts(posts);

    const postsWithLikes = formattedPosts.map((post: any) => ({
      ...post,
      totalLikes: post.userLikes.length,
      isLiked: post.userLikes.some(
        (like: any) => like.userId === sessionUser.id
      ),
    }));

    return {
      props: {
        isUser: sessionUser.id === userId,
        user: userDetails,
        posts: postsWithLikes,
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
        user: sessionUser,
      },
    };
  }
};
export default Profile;
