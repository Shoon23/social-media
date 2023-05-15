import React, { useState } from "react";

import { UserIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { iFriend, iMySession, iReceiveRequest } from "@/types";
import { toast } from "react-hot-toast";

interface Props {
  user: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  setFriendList: React.Dispatch<React.SetStateAction<iFriend[]>>;
  setReceiveRequest: React.Dispatch<React.SetStateAction<iReceiveRequest[]>>;
}

const RequestCard: React.FC<Props> = ({
  user,
  setFriendList,
  setReceiveRequest,
}) => {
  const session = useSession();
  const sessionUser = session.data?.user as iMySession;
  const [countClick, setCountClick] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAcceptFriend = async () => {
    setCountClick((prev) => prev + 1);
    const res = await fetch("/api/user/friend/accept", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionUser.id,
        friendId: user.userId,
        friendRequestId: user.id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setIsAccepted(true);
      setTimeout(() => {
        setReceiveRequest((prev) =>
          prev.filter((usr) => usr.senderId !== user.userId)
        );
      }, 5000);
      setFriendList((prev) => [...prev, data]);
    }

    if (res.status === 500) {
      if (countClick <= 3) {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="flex m-2  mb-3 items-center justify-between ">
      <Link href={`/profile/${user.userId}`} className="flex items-center">
        <div className="avatar cursor-pointer">
          <div className="w-12 rounded-full">
            {user?.avatar ? <img src={user.avatar} alt="" /> : <UserIcon />}
          </div>
        </div>
        <div className="cursor-pointer">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
        </div>
        {isAccepted ? (
          <h1 className="ml-5 text-sm text-gray-500">
            friend request accepted
          </h1>
        ) : (
          <h1 className="ml-5 text-sm text-gray-500">Sent a friend request</h1>
        )}
      </Link>
      <button onClick={handleAcceptFriend} disabled={isAccepted}>
        <CheckIcon
          className={`w-7 h-7  cursor-pointer ${
            isAccepted ? `fill-gray-500` : `fill-green-500`
          }`}
        />
      </button>
    </div>
  );
};

export default RequestCard;
