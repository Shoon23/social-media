import React, { useState } from "react";
import {
  HomeIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import NewPostModal from "./Home/NewPostModal";
import { iMySession } from "@/types";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactElement;
}
function HomeLayout({ children }: Props) {
  const session = useSession();
  const sessionUser = session.data?.user as iMySession;
  const router = useRouter();
  const [searchKey, setSearchKey] = useState("");

  return (
    <>
      <Toaster />

      {/* Header Start */}
      <header className="navbar bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost normal-case text-xl">
            Social
          </Link>
        </div>
        <div className="flex-none gap-2">
          <form
            className="form-control"
            onSubmit={(e) => {
              e.preventDefault();
              router.push({
                pathname: "/search",
                query: { s: searchKey },
              });
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered"
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
            />
          </form>
          <div className="dropdown dropdown-end">
            <Link
              href={`/profile/${sessionUser?.id}`}
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <UserIcon className="" />
              </div>
            </Link>
          </div>
        </div>
      </header>
      {/* Header End */}
      <NewPostModal />
      {/* Mobile Nav Start */}
      <main className="flex min-h-[90vh]">
        <div className="btm-nav md:hidden">
          <label htmlFor="my-modal-4" className="text-primary">
            <PlusIcon className="w-8 h-8" />
          </label>
          <Link href={"/"} className="text-primary">
            <HomeIcon className="w-8 h-8" />
          </Link>
          <Link href={"/friends"} className="text-primary">
            <UsersIcon className="w-8 h-8" />
          </Link>
          <button
            onClick={() =>
              signOut({ redirect: true, callbackUrl: "/auth/login" })
            }
            className="text-accent"
          >
            <ArrowLeftOnRectangleIcon className="lg:hidden w-7 h-7" />
            <span className="hidden lg:block">Log out</span>
          </button>
        </div>
        {/* Mobile Nav End */}
        <aside className="bg-base-100 hidden md:block ">
          <ul className="flex flex-col p-3 lg:p-10 gap-2 ">
            <label
              htmlFor="my-modal-4"
              className="lg:flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 items-center  cursor-pointer active:scale-x-110"
            >
              <PlusIcon className="w-8 h-8" />
              <span className="hidden lg:block">New Post</span>
            </label>
            <Link
              href={"/"}
              className="lg:flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 items-center  cursor-pointer active:scale-x-110"
            >
              <HomeIcon className="w-8 h-8" />
              <span className="hidden lg:block">Home</span>
            </Link>
            <Link
              href={"/friends"}
              className="lg:flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 items-center cursor-pointer active:scale-x-110"
            >
              <UsersIcon className="w-8 h-8" />
              <span className="hidden lg:block">Friends</span>
            </Link>
            <li className="">
              <button
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/auth/login" })
                }
                className=" rounded-md btn btn-active btn-primary"
              >
                <ArrowLeftOnRectangleIcon className="lg:hidden w-7 h-7" />
                <span className="hidden lg:block">Log out</span>
              </button>
            </li>
          </ul>
        </aside>
        <section className="bg-base-200 grow">{children}</section>
      </main>
    </>
  );
}

export default HomeLayout;
