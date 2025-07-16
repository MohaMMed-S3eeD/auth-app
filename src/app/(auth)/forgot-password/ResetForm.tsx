"use client";
import Spiner from "@/app/_components/spiner";
import { resetPasswordAction } from "@/app/actions/pass.action";
import { resetPasswordSchema } from "@/utils/validationSchmas";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ResetForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valdation = resetPasswordSchema.safeParse({ email });
    if (!valdation.success) {
      toast.error(valdation.error.message);
      return;
    }
    setIsLoading(true);
    resetPasswordAction(valdation.data).then((res) => {
      if (res.success) {
        setIsLoading(false);
        toast.success(res.message);
      } else {
        setIsLoading(false);
        toast.error(res.error);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default ResetForm;
