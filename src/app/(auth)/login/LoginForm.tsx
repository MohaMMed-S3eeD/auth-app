"use client";
import Spiner from "@/app/_components/spiner";
import { loginAction } from "@/app/actions/auth.action";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    loginAction({ email, password }).then((res) => {
      setIsLoading(true);
      if (!res.success) {
        setIsLoading(false);
        toast.error(res.error);
      } else {
        setIsLoading(false);
        toast.success(res.message);
      }
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
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link href="/forgot-password " className="text-sm text-gray-500">Forgot Password</Link>
        <button
          type="submit"
          className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {isLoading ? <Spiner /> : "Sign In"}
        </button>
      </form>
      
      <SocialProviders />
    </div>
  );
};

export default LoginForm;
