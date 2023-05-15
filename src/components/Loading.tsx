import { ArrowPathIcon } from "@heroicons/react/24/solid";
import React from "react";

const Loading = () => {
  return (
    <section className="bg-base-100 flex items-center justify-center h-screen">
      <ArrowPathIcon className="w-7 h-7 cursor-pointer animate-spin rounded-md" />
    </section>
  );
};

export default Loading;
