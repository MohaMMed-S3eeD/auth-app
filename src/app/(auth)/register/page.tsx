import React from "react";
import RegisterForm from "./RegisterForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <RegisterForm />
          <SocialProviders />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-gray-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
