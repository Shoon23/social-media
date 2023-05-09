import React, { useRef } from "react";

import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { iFriend, iSentRequest } from "@/types";
import YesOrNo from "./YesOrNo";
import Link from "next/link";

interface Props {
  user: {
    userId: string;
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  setSentRequest: React.Dispatch<React.SetStateAction<iSentRequest[]>>;
}

const SentCard: React.FC<Props> = ({ user, setSentRequest }) => {
  const closeRef = useRef<HTMLLabelElement>(null);

  const handleCancelRequest = async () => {
    try {
      const res = await fetch(
        `/api/user/friend/cancel?friendRequestId=${user.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        closeRef?.current?.click();
        setTimeout(() => {
          setSentRequest((prev) => prev.filter((usr) => usr.id !== user.id));
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex m-2  mb-3 items-center justify-between ">
      {/* Modal Start */}
      <YesOrNo
        question="Do you want to cancel the friend request?"
        modalId={"sentCard"}
        closeRef={closeRef}
        handleYes={handleCancelRequest}
      />
      {/* Modal End */}

      <Link href={`/profile/${user.userId}`} className="flex items-center">
        <div className="avatar cursor-pointer">
          <div className="w-12 rounded-full">
            {user?.avatar ? (
              <img src={user.avatar} className="w-12" alt="" />
            ) : (
              <UserIcon />
            )}
          </div>
        </div>
        <div className="cursor-pointer">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
        </div>
        <h1 className="ml-5 text-sm text-gray-500">Pending</h1>
      </Link>

      <label htmlFor="sentCard">
        <XMarkIcon className="w-7 h-7 fill-red-500 cursor-pointer" />
      </label>
    </div>
  );
};

export default SentCard;
