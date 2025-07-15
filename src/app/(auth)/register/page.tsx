import React from "react";
import RegisterForm from "./RegisterForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create your account
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <RegisterForm />
          <SocialProviders />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
