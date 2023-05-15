import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";

const ErrorPrisma = () => {
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };
  return (
    <section className="flex flex-col place-items-center gap-2">
      <h1 className="text-red-500">Something Went Wrong</h1>
      <ArrowPathIcon
        onClick={handleRefresh}
        className="w-7 h-7 cursor-pointer hover:animate-spin active:scale-110 rounded-md"
      />
    </section>
  );
};

export default ErrorPrisma;
