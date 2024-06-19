import React from "react";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";

const Register = () => {
  const [isNext, setIsNext] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    plainPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    plainPassword: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    plainPassword: "",
    confirmPassword: "",
  });
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.firstName) {
      return setErrors((prev) => ({
        ...prev,
        firstName: "Missing First Name",
      }));
    }
    if (!formData.lastName) {
      return setErrors((prev) => ({
        ...prev,
        lastName: "Missing Last name",
      }));
    }
    setIsNext(true);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    if (!formData.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Missing Email",
      }));
      // setIsLoading(false);

      return;
    }
    if (!formData.plainPassword || formData.plainPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password Required or too Short",
      }));
      // setIsLoading(false);

      return;
    }
    if (
      !formData.confirmPassword ||
      formData.confirmPassword !== formData.plainPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Empty Field or Password Dont Match",
      }));
      // setIsLoading(false);

      return;
    }

    try {
      const res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(res);
      if (res.status === 409) {
        toast.error("User Already Registered");
        return;
      }
      if (res.status === 500) {
        toast.error("Something went wrong");
        return;
      }

      setIsLoading(false);

      router.push("/auth/login");
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleBackButton = () => {
    setIsNext(false);
  };
  if (session.status === "loading") {
    return (
      <section className="bg-base-100 flex items-center justify-center h-screen">
        <Loading />
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

      <form
        onSubmit={handleSubmit}
        className="card flex-shrink-0 w-full order-last max-w-sm shadow-2xl bg-base-100"
      >
        <div className="card-body">
          <h1 className="text-5xl font-bold">Register</h1>

          {!isNext ? (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  onChange={handleOnChange}
                  value={formData.firstName}
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="input input-bordered"
                />
                {errors?.firstName && (
                  <label className="label">
                    <span className="label-text text-red-500">
                      {errors.firstName}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  onChange={handleOnChange}
                  value={formData?.lastName}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered"
                />
                {errors?.lastName && (
                  <label className="label">
                    <span className="label-text text-red-500">
                      {errors?.lastName}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control mt-6">
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={handleBackButton}>
                <h1 className="flex place-items-center cursor-pointer active:text-black gap-1">
                  <ArrowLeftIcon className="w-5 h-5" /> Back
                </h1>
              </button>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  onChange={handleOnChange}
                  value={formData?.email}
                  name="email"
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                />
                {errors?.email && (
                  <label className="label">
                    <span className="label-text text-red-500">
                      {errors?.email}
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
                  value={formData?.plainPassword}
                  name="plainPassword"
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                />
                {errors?.plainPassword && (
                  <label className="label">
                    <span className="label-text text-red-500">
                      {errors?.plainPassword}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  onChange={handleOnChange}
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="input input-bordered"
                />
              </div>
              {errors?.confirmPassword && (
                <label className="label">
                  <span className="label-text text-red-500">
                    {errors.confirmPassword}
                  </span>
                </label>
              )}

              <div className="form-control mt-6">
                <button disabled={isLoading} className="btn btn-primary">
                  Create
                </button>
              </div>
            </>
          )}

          <label className="label">
            <Link
              href="/auth/login"
              className="label-text-alt link link-hover underline text-blue-400"
            >
              Already Have an account?
            </Link>
          </label>
        </div>
      </form>
    </section>
  );
};

Register.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};

export default Register;
