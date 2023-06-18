import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Loading from "@/components/Loading";

const Login = () => {
  const [formData, setFormData] = useState<{
    email: string;
    plainPassword: string;
  }>({ email: "", plainPassword: "" });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setError] = useState({
    email: "",
    plainPassword: "",
    response: "",
  });
  const session = useSession();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { email, plainPassword } = formData;
    const errorState = {
      email: !email ? "Email Is Required" : "",
      plainPassword: !plainPassword ? "Password Is Required" : "",
    };
    const hasErrors = Object.values(errorState).some(Boolean);

    if (hasErrors) {
      setError((prev) => ({ ...prev, ...errorState }));
      return;
    }
    setIsLoading(true);

    const res = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      if (res?.error === "500") {
        toast.error("Something Went Wrong");
      } else {
        setError((prev) => ({ ...prev, response: res?.error as string }));
      }
    }
    setIsLoading(false);
  };
  if (session.status === "loading") {
    return (
      <section className="bg-base-100 flex items-center justify-center h-screen">
        <Loading />;
      </section>
    );
  }
  if (session.status === "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <section className="hero h-screen overflow-y-scroll bg-base-200">
      <Toaster />
      <div className="flex flex-col gap-5 lg:flex-row-reverse">
        <form
          onSubmit={handleSubmit}
          className="card flex-shrink-0  order-last  w-full max-w-sm shadow-2xl bg-base-100"
        >
          <div className="card-body">
            {errors?.response && (
              <label className="label">
                <span className="label-text text-red-500">
                  {errors.response}
                </span>
              </label>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                onChange={handleOnChange}
                value={formData.email}
                name="email"
                type="text"
                placeholder="email"
                className="input input-bordered"
              />
              {errors?.email && (
                <label className="label">
                  <span className="label-text text-red-500">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={handleOnChange}
                value={formData.plainPassword}
                name="plainPassword"
                type="password"
                placeholder="password"
                className="input input-bordered"
              />
              {errors?.plainPassword && (
                <label className="label">
                  <span className="label-text text-red-500">
                    {errors.plainPassword}
                  </span>
                </label>
              )}
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
              <label className="label">
                <Link
                  href="/auth/register"
                  className="label-text-alt link link-hover underline text-blue-400"
                >
                  New User?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button disabled={isLoading} className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </form>
        <div className="text-center lg:text-left w-96  lg:order-last">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
      </div>
    </section>
  );
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};

export default Login;
