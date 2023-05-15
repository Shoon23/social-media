import Link from "next/link";
import React from "react";

const Custom404 = () => {
  return (
    <section className="bg-base-100 flex flex-col items-center justify-center h-screen gap-2">
      <h1 className="text-xl">
        <span className="text-4xl">404</span> - Page Not Found
      </h1>
      <Link className="underline underline-offset-1 text-blue-400" href={"/"}>
        Home
      </Link>
    </section>
  );
};

Custom404.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};
export default Custom404;
