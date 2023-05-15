import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  UserMinusIcon,
} from "@heroicons/react/24/solid";
import RequestCard from "@/components/Friends/RequestCard";
import SentCard from "@/components/Friends/SentCard";
import { getServerSession } from "next-auth";
import { iFriend, iMySession, iReceiveRequest, iSentRequest } from "@/types";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { formatPosts } from "@/utils/postUtils";
import FriendCard from "@/components/Friends/FriendCard";
import ErrorPrisma from "@/components/ErrorPrisma";

interface Props {
  sent: iSentRequest[];
  receive: iReceiveRequest[];
  friend: iFriend[];
  isError: boolean;
}

const index: React.FC<Props> = ({
  receive = [],
  sent = [],
  friend = [],
  isError = false,
}) => {
  useEffect(() => {
    setFriendList(friend);
    setReceiveRequest(receive);
    setSentRequest(sent);
  }, []);

  const [currentSelected, setCurrentSelected] = useState(1);
  const [friendList, setFriendList] = useState<iFriend[]>([]);
  const [receiveRequest, setReceiveRequest] = useState<iReceiveRequest[]>([]);
  const [sentRequest, setSentRequest] = useState<iSentRequest[]>([]);
  const handleSelect = (idx: number) => {
    setCurrentSelected(idx);
  };
  return (
    <div className="flex flex-col items-center mt-3 gap-2">
      <div className="gap-3 flex">
        <button
          onClick={() => handleSelect(1)}
          className={`${
            currentSelected === 1
              ? "btn btn-primary rounded-2xl"
              : "btn bg-base-200 border-none rounded-2xl"
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => handleSelect(2)}
          className={`${
            currentSelected === 2
              ? "btn btn-primary rounded-2xl"
              : "btn bg-base-200 border-none rounded-2xl"
          }`}
        >
          Request
        </button>
        <button
          onClick={() => handleSelect(3)}
          className={`${
            currentSelected === 3
              ? "btn btn-primary rounded-2xl"
              : "btn bg-base-200 border-none rounded-2xl"
          }`}
        >
          Sent
        </button>
      </div>

      <div className=" flex flex-col  w-[50%] items-center">
        <div className="flex place-items-center w-[350px] lg:w-full">
          <input
            type="text"
            placeholder="Search Here"
            className="input w-full  m-2"
          />
          <MagnifyingGlassIcon className="cursor-pointer w-7 h-7 mr-2" />
        </div>
        <div
          className={`overflow-y-scroll h-[450px] w-[300px] lg:w-full${
            isError && "flex flex-col justify-center"
          }`}
        >
          {(() => {
            switch (currentSelected) {
              case 1:
                return friendList.length !== 0 ? (
                  friendList.map((user) => (
                    <FriendCard
                      setFriendList={setFriendList}
                      user={{ ...user.friend, id: user.id }}
                      key={user.id}
                    />
                  ))
                ) : isError ? (
                  <ErrorPrisma />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No Friend
                  </div>
                );
              case 2:
                return receiveRequest.length !== 0 ? (
                  receiveRequest.map((user) => (
                    <RequestCard
                      setReceiveRequest={setReceiveRequest}
                      setFriendList={setFriendList}
                      user={{ ...user.sender, id: user.id }}
                      key={user.id}
                    />
                  ))
                ) : isError ? (
                  <ErrorPrisma />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No Friend Request
                  </div>
                );
              case 3:
                return sentRequest.length !== 0 ? (
                  sentRequest.map((user) => (
                    <SentCard
                      setSentRequest={setSentRequest}
                      user={{ ...user.receiver, id: user.id }}
                      key={user.id}
                    />
                  ))
                ) : isError ? (
                  <ErrorPrisma />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No Friend Request Sent
                  </div>
                );
            }
          })()}
        </div>
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
    const friendRequest = await prisma.user.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        sentRequests: {
          include: {
            receiver: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        receivedRequests: {
          include: {
            sender: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        friends: {
          select: {
            id: true,
            friend: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const formatedSentRequests = formatPosts(friendRequest?.sentRequests);
    const formatedReceiveRequests = formatPosts(
      friendRequest?.receivedRequests
    );

    return {
      props: {
        sent: formatedSentRequests,
        receive: formatedReceiveRequests,
        friend: friendRequest?.friends,
      },
    };
  } catch (error) {
    return {
      props: {
        isError: true,
      },
    };
  }
};

export default index;
