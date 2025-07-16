import React from "react";
import ResetPasswordForm from "./ResetForm";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default page;
