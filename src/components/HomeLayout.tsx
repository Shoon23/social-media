import React from "react";
import { HomeIcon, PlusIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserIcon } from "@heroicons/react/24/outline";
import NewPostModal from "./Home/NewPostModal";
import { iMySession } from "@/types";
import UpdateModal from "./Home/UpdateCommentModal";
interface Props {
  children: React.ReactElement;
}
function HomeLayout({ children }: Props) {
  const session = useSession();
  const sessionUser = session.data?.user as iMySession;

  return (
    <>
      {/* Add Post Modal Start */}
      <NewPostModal />
      {/* Add Post Modal End */}

      <header className="navbar bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost normal-case text-xl">
            Social
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered"
            />
          </div>
          <div className="dropdown dropdown-end">
            <Link
              href={`/profile/${sessionUser?.id}`}
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <UserIcon className="" />
                {/* <img src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=5OK7djfD3cnNmQ-DR0iQzF-vmA-iTNN1TbuEyCG1DfA=" /> */}
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex min-h-[90vh]">
        <aside className="bg-base-100">
          <ul className="flex flex-col p-10 gap-2 ">
            <label
              htmlFor="my-modal-4"
              className="flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 place-items-center cursor-pointer active:scale-x-110"
            >
              <PlusIcon className="w-8 h-8  " />
              <span>New Post</span>
            </label>
            <Link
              href={"/"}
              className="flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 place-items-center cursor-pointer active:scale-x-110"
            >
              <HomeIcon className="w-8 h-8  " />
              <span>Home</span>
            </Link>
            <li className="flex text-xl gap-2 p-2 rounded-lg hover:bg-base-200 place-items-center cursor-pointer active:scale-x-110">
              <Cog8ToothIcon className="w-8 h-8" />
              <span>Setting</span>
            </li>
            <li className="">
              <button
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/auth/login" })
                }
                className=" rounded-md btn btn-active btn-primary"
              >
                Logout
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
