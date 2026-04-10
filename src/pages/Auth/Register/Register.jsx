import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../../Javascript/auth";

const registSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("*Name is required")
      .min(3, "*Name must be at least 3 characters")
      .max(20, "*Name cannot be more than 20 characters"),
    email: zod.string().email("*Email is invalid"),
    password: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "*Password should be at least 8 characters, with uppercase, lowercase, number and special character",
      ),
    rePassword: zod.string().nonempty("*Confirm password is required"),
    dateOfBirth: zod.string().nonempty("*Date is required"),
    gender: zod
      .string({ required_error: "*Gender is required" })
      .min(1, "*Please select a valid gender"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "*Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registSchema),
    mode: "all",
  });

  const submitRegisterForm = (data) => {
    setIsLoading(true);
    registerUser(data)
      .then((res) => {
        if (res.success === true) {
          navigate("/auth", {
            state: {
              successMsg: "Welcome! Your account is created. Please login.",
            },
          });
        }
      })
      .catch((errMessage) => {
        setError("email", { type: "manual", message: errMessage });
      })
      .finally(() => setIsLoading(false));
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

          <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5 text-left">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
              About Route Academy
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's Leading IT Training Center Since 2012
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming and web development.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { val: "2012", label: "Founded" },
                { val: "40K+", label: "Graduates" },
                { val: "50+", label: "Partners" },
                { val: "5", label: "Branches" },
                { val: "20", label: "Diplomas" },
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
                Create a new account
              </p>
            </div>

       
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <NavLink
                to="/auth"
                className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800 text-center"
              >
                Login
              </NavLink>
              <button className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm">
                Register
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              Create a new account
            </h2>
            <p className="mt-1 text-sm text-slate-500 mb-5">
              It is quick and easy.
            </p>

            <form
              onSubmit={handleSubmit(submitRegisterForm)}
              className="space-y-3.5"
            >
      
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaUser size={16} />
                </span>
                <input
                  {...register("name")}
                  placeholder="Full name"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.name ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

       
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaEnvelope size={16} />
                </span>
                <input
                  {...register("email")}
                  placeholder="Email address"
                  type="email"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.email ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

     
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaUsers size={16} />
                </span>
                <select
                  {...register("gender")}
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.gender ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaCalendarAlt size={16} />
                </span>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.dateOfBirth ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

     
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaLock size={16} />
                </span>
                <input
                  {...register("password")}
                  placeholder="Password"
                  type="password"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.password ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

         
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaLock size={16} />
                </span>
                <input
                  {...register("rePassword")}
                  placeholder="Confirm password"
                  type="password"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white ${errors.rePassword ? "border-red-500" : "border-slate-200 focus:border-[#00298d]"}`}
                />
                {errors.rePassword && (
                  <p className="text-[10px] text-red-500 mt-1 ml-1">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b] flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Create New Account"
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
