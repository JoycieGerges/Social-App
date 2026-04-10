import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import {
  FaShieldAlt,
  FaBell,
  FaLock,
  FaPalette,
  FaInfoCircle,
  FaKey,
  FaCheck,
  FaSpinner,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { Form, Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { changePassword } from "../../Javascript/changePassword";
import { toast } from "react-toastify";

const passwordSchema = zod
  .object({
    password: zod.string().nonempty("*Current password is required"),
    newPassword: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "*Weak password",
      ),
    rePassword: zod.string().nonempty("*Please confirm password"),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "*Passwords do not match",
    path: ["rePassword"],
  });

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  const [visibleFields, setVisibleFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    changePassword(data)
      .then((res) => {
        console.log(res);

        if (res.success === true) {
          if (res.token) {
            localStorage.setItem("userToken", res.data.token);
          }
          toast.success("Password Updated Successfully", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });

          reset();
        }
      })
      .catch((err) => {
        toast.error(err.message || "Update Failed", {
          theme: "colored",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const renderEyeButton = (field) => (
    <button type="button" onClick={() => toggleVisibility(field)}>
      {visibleFields[field] ? (
        <FaEye className="text-slate-400" />
      ) : (
        <FaEyeSlash className="text-slate-400" />
      )}
    </button>
  );

  return (
    <>

      <div className="lg:col-span-2">
        <div className="w-full bg-white rounded-3xl overflow-hidden shadow-md border p-6 border-gray-100 mb-6 flex flex-col justify-center items-start">
          <div className="flex flex-row mb-2">
            <IoMdSettings className="text-[#99A1AF] text-3xl" />
            <h1 className="font-bold text-2xl text-[#1e2939] ms-2">Settings</h1>
          </div>
          <p className="text-[16px] font-normal text-[#6a7282]">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-150">
     
        <div className="w-full md:w-1/3 border-r border-gray-100 p-6 space-y-2">
          <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-2xl shadow-md cursor-pointer">
            <FaShieldAlt />
            <span className="font-medium">Security</span>
          </div>

          {[
            { name: "Notifications", icon: <FaBell /> },
            { name: "Privacy", icon: <FaLock /> },
            { name: "Appearance", icon: <FaPalette /> },
            { name: "About", icon: <FaInfoCircle /> },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 text-slate-500 hover:bg-gray-50 rounded-2xl transition-all cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-wider font-bold">
                Soon
              </span>
            </div>
          ))}
        </div>

   
        <div className="w-full md:w-2/3 p-8">
          <div className="flex items-center gap-3 mb-2">
            <FaKey className="text-blue-500 text-xl -rotate-90" />
            <h2 className="text-xl font-bold text-slate-800">
              Change Password
            </h2>
          </div>
          <p className="text-slate-400 mb-8 text-sm font-normal">
            Update your password to keep your account secure
          </p>

          <Form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
   
            <Input
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              label="Current Password"
              labelPlacement="outside"
              placeholder="Enter current password"
              type={visibleFields.current ? "text" : "password"}
              variant="bordered"
              startContent={<FaLock className="text-gray-400 text-[16px]" />}
              endContent={renderEyeButton("current")}
            />

     
            <Input
              {...register("newPassword")}
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              label="New Password"
              labelPlacement="outside"
              placeholder="Enter new password"
              type={visibleFields.new ? "text" : "password"}
              variant="bordered"
              startContent={<FaLock className="text-blue-400 text-[16px]" />}
              endContent={renderEyeButton("new")}
            />

         
            <Input
              {...register("rePassword")}
              isInvalid={!!errors.rePassword}
              errorMessage={errors.rePassword?.message}
              label="Confirm New Password"
              labelPlacement="outside"
              placeholder="Confirm new password"
              type={visibleFields.confirm ? "text" : "password"}
              variant="bordered"
              startContent={<FaLock className="text-cyan-400 text-[16px]" />}
              endContent={renderEyeButton("confirm")}
            />

         
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
              <p className="text-slate-600 font-medium mb-3">
                Password must contain:
              </p>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  One uppercase letter (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  One lowercase letter (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  One Number (1-9)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  One special character (#?!@$%^&*-)
                </li>
              </ul>
            </div>

         
            <Button
              className={`w-full font-bold text-[16px] text-white py-7 rounded-2xl shadow-lg transition-all ${
                !isValid || isLoading
                  ? "bg-[#707888] cursor-not-allowed"
                  : "bg-linear-to-r from-blue-400 to-cyan-400 shadow-blue-200 hover:opacity-90"
              }`}
              type="submit"
              isDisabled={!isValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  Updating Password <FaSpinner className="animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Update Password <FaCheck />
                </div>
              )}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
