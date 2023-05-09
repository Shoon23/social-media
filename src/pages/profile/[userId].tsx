import React, { useEffect, useState } from "react";
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
import { formatPosts } from "@/utils/postUtils";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { json } from "stream/consumers";

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
  useEffect(() => {
    setIsRequested(user.isRequested);
    setIsFriend(user.isFriend);
    setIsReceive(user.isReceive);
  }, []);

  const router = useRouter();
  const session = useSession();
  const sessionUser = session.data?.user as iMySession;
  const [isFriend, setIsFriend] = useState<boolean>();
  const [isRequested, setIsRequested] = useState<boolean>();
  const [isReceive, setIsReceive] = useState<boolean>();

  const handleRefresh = () => {
    router.reload();
  };

  const handleFriendRequest = async () => {
    try {
      const res = await fetch("/api/user/friend/request", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          senderId: sessionUser.id,
          receiverId: user.userId,
        }),
      });
      if (res.ok) {
        setIsRequested(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const res = await fetch("/api/user/friend/accept", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: sessionUser.id,
          friendId: user.userId,
        }),
      });
      if (res.ok) {
        setIsFriend(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-base-100 h-[88vh] overflow-y-scroll">
      <div className="flex gap-2 flex-col items-center p-20">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="avatar">
            <div className="w-40 rounded-full">
              {user?.avatar ? (
                <img src={user.avatar} className="w-40" alt="" />
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
              {isFriend ? (
                <button className="btn btn-secondary">
                  <CheckIcon className="w-5 h-5" /> Friend
                </button>
              ) : isRequested ? (
                <button className="btn btn-secondary">
                  <CheckIcon className="w-5 h-5" /> Request Sent
                </button>
              ) : isReceive ? (
                <button onClick={handleAcceptFriend} className="btn btn-info">
                  <CheckIcon className="w-5 h-5" /> Accept Friend Request
                </button>
              ) : (
                <button className="btn btn-info" onClick={handleFriendRequest}>
                  Add Friend
                </button>
              )}
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
    const getUser = await prisma.user.findUnique({
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
        friends: {
          where: {
            friendId: sessionUser.id,
          },
          select: {
            id: true,
          },
        },
        receivedRequests: {
          where: {
            senderId: sessionUser.id,
          },
          select: {
            id: true,
          },
        },
        sentRequests: {
          where: {
            receiverId: sessionUser.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const { posts, friends, receivedRequests, sentRequests, ...userDetails } =
      getUser as any;
    console.log(userDetails);
    const user = {
      ...userDetails,
      isFriend: friends?.length !== 0 && true,
      isRequested: receivedRequests?.length !== 0 && true,
      isReceive: sentRequests.length !== 0 && true,
    };
    console.log(userDetails);
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
        user,
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
