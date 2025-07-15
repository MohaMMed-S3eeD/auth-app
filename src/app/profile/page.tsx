import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { logoutAction } from "../actions/auth.action";
import Image from "next/image";

const Profile = async () => {
  const session = await auth();
  if (!session) {
    console.log("session", session);
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Profile
        </h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          {session.user?.role === "ADMIN" ? (
            <div className="border-2 border-green-500 rounded-full p-1">
              <Image
                src={session.user?.image || "/user.svg"}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-full p-1">
              <Image
                src={session.user?.image || "/user.svg"}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">
              Name
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <p className="text-gray-800">{session.user?.name || "N/A"}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">
              Role
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <p className="text-gray-800">{session.user?.role}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">
              Email
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <p className="text-gray-800 text-sm">{session.user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">
              User ID
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <p className="text-gray-600 text-xs font-mono">
                {session.user?.id}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">
              Email Verified
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
              <p className="text-gray-600 text-xs">
                {session.user?.emailVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
