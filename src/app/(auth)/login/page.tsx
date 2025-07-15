import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Sign in to your account
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <LoginForm />

          <div className="mt-6">
            

           
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?
                <Link href="/register" className="text-blue-500">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
