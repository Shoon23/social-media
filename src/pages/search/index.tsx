import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { iMySession } from "@/types";
import { prisma } from "@/lib/prisma";
import {
  MagnifyingGlassIcon,
  UserIcon,
  UserMinusIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Loading from "@/components/Loading";
import SearchResultCard from "@/components/Search/SearchResultCard";
import ErrorPrisma from "@/components/ErrorPrisma";

interface Props {
  searchResults: {
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  }[];
  searchKey: string;
  isError: boolean;
}

const SearchResult: React.FC<Props> = ({
  searchResults,
  searchKey,
  isError = false,
}) => {
  return (
    <div className="flex flex-col items-center mt-3 gap-2">
      <div className=" flex flex-col  w-[50%] items-center">
        <h1 className="text-2xl">
          Search Result: <span className="text-blue-400">{searchKey}</span>
        </h1>
        <div
          className={`overflow-y-scroll h-[450px] w-[300px] lg:w-full${
            isError && "flex flex-col justify-center"
          }`}
        >
          <Suspense fallback={<Loading />}>
            {searchResults.length !== 0 ? (
              searchResults.map((search) => <SearchResultCard user={search} />)
            ) : (
              <div className="text-white flex justify-center mt-10 text-lg">
                {isError ? <ErrorPrisma /> : <h1 className="">No Results</h1>}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchKey = (context?.query?.s as string) || "";
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  try {
    const searchResults = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: searchKey } },
          { lastName: { contains: searchKey } },
          { email: { contains: searchKey } },
        ],
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    return {
      props: {
        searchResults,
        searchKey,
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

export default SearchResult;
