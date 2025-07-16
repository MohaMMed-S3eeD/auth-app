"use client";
import Spiner from "@/app/_components/spiner";
import { resetPasswordAction } from "@/app/actions/pass.action";
import { resetPasswordSchema } from "@/utils/validationSchmas";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(password, confirmPassword, token);
    const valdation = resetPasswordSchema.safeParse({
      newPassword: password,
      confirmPassword,
    });
    if (!valdation.success) {
      toast.error(JSON.parse(valdation.error.message)[0].message);
      return;
    } 
    setIsLoading(true);
    resetPasswordAction(
      {
        newPassword: password,
        confirmPassword,
      },
      token || ""
    ).then((res) => {
      if (res.success) {
        setIsLoading(false);
        toast.success(res.message);
      } else {
        setIsLoading(false);
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Enter your confirm password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {isLoading ? <Spiner /> : "Submit"}
        </button>
        <button>
          <Link href="/login">Back to login</Link>
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
