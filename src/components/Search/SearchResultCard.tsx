import { UserIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

const SearchResultCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="flex mt-3 mb-3 items-center justify-between last:mb-10">
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
    </div>
  );
};

export default SearchResultCard;
