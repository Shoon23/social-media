import React, { useRef, useState } from "react";
import { UserIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import YesOrNo from "./YesOrNo";
import { StreamingProfiles } from "cloudinary";
import { iFriend, iMySession } from "@/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  user: {
    userId: string;
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  setFriendList: React.Dispatch<React.SetStateAction<iFriend[]>>;
}

const FriendCard: React.FC<Props> = ({ user, setFriendList }) => {
  const closeRef = useRef<HTMLLabelElement>(null);
  const session = useSession();
  const sessionUser = session.data?.user as iMySession;

  const [clickCount, setClickCount] = useState(0);

  const handleRemoveFriend = async () => {
    setClickCount((prev) => prev + 1);
    const res = await fetch(
      `/api/user/friend/remove?friendId=${user.userId}&userId=${sessionUser.id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setFriendList((prev) => prev.filter((usr) => usr.id !== user.id));
      return;
    }

    if (res.status === 500) {
      if (clickCount <= 3) {
        toast.error("Something Went Wrong");
      }
    }
  };
  return (
    <div className="flex m-2  mb-3 items-center justify-between ">
      {/* Modal Start */}
      <YesOrNo
        question={`Do you want to remove ${
          user.firstName + " " + user.lastName
        } as your friend?`}
        modalId={"friendCard"}
        closeRef={closeRef}
        handleYes={handleRemoveFriend}
      />
      {/* Modal End */}
      <Link href={`/profile/${user.userId}`} className="flex items-center">
        <div className="avatar cursor-pointer">
          <div className="w-12 rounded-full">
            {user?.avatar ? <img src={user.avatar} alt="" /> : <UserIcon />}
          </div>
        </div>
        <div className="cursor-pointer">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
        </div>
      </Link>
      <label htmlFor="friendCard">
        <UserMinusIcon className="w-7 h-7 fill-red-500 cursor-pointer" />
      </label>
    </div>
  );
};

export default FriendCard;
