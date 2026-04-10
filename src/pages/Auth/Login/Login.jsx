import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../../Javascript/auth";
import { FaSpinner, FaUser, FaKey } from "react-icons/fa";
import { UserContext } from "../../../App";

const loginSchema = zod.object({
  email: zod.string().email("*Email is invalid"),
  password: zod.string().min(8, "*Password is Too Short"),
});

export default function Login() {
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const submitLoginForm = (data) => {
    setisLoading(true);
    loginUser(data)
      .then((res) => {
        if (res.success === true) {
          localStorage.setItem("userToken", res.data.token);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
          setUserData(res.data.user);
          navigate("/", { state: { successMsg: "Welcome Back!" } });
        }
      })
      .catch((errMessage) => {
        console.log(errMessage);
        setError("email", {
          type: "manual",
          message: errMessage,
        });
      })
      .finally(() => setisLoading(false));
  };

  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">

        <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl lg:block">
            Route Posts
          </h1>
          <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
              About Route Academy
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's Leading IT Training Center Since 2012
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming, web development, and application
              development.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { val: "2012", label: "Founded" },
                { val: "40K+", label: "Graduates" },
                { val: "50+", label: "Partner Companies" },
                { val: "5", label: "Branches" },
                { val: "20", label: "Diplomas Available" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2"
                >
                  <p className="text-base font-extrabold text-[#00298d]">
                    {stat.val}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

    
        <section className="order-1 w-full max-w-107.5 lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl shadow-slate-200">
  
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>
              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Connect with friends and the world around you.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm">
                Login
              </button>
              <NavLink
                to="/auth/register"
                className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800 text-center"
              >
                Register
              </NavLink>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              Log in to Route Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Log in and continue your social journey.
            </p>

            <form
              onSubmit={handleSubmit(submitLoginForm)}
              className="mt-5 space-y-3.5"
            >
     
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaUser size={18} />
                </span>
                <input
                  {...register("email")}
                  placeholder="Email or username"
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white ${errors.email ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"} bg-slate-50`}
                  type="text"
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-1 ml-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

         
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaKey size={18} />
                </span>
                <input
                  {...register("password")}
                  placeholder="Password"
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white ${errors.password ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"} bg-slate-50`}
                  type="password"
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-1 ml-2">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b] flex justify-center items-center gap-2"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : "Log In"}
              </button>

              <button
                type="button"
                className="mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline"
              >
                Forgot password?
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
