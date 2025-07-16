import { verifyEmailAction } from "@/app/actions/verification.action";
import Link from "next/link";
import React from "react";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { token } = await searchParams;
  const result = await verifyEmailAction(token);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {result.success ? (
          <>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600">
                Your email has been successfully verified. You can now log in to your account.
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-500">Verification Complete</span>
                </div>
                
                <Link 
                  href="/login"
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Continue to Login
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600">
                {result.error || "We couldn't verify your email. Please try again."}
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-500">Verification Failed</span>
                </div>
                
                <div className="space-y-3">
                  <Link 
                    href="/register"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Request New Verification
                  </Link>
                  
                  <Link 
                    href="/login"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
