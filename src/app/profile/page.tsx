import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { logoutAction } from "../actions/auth.action";

const Profile = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
        <div className="space-y-3">
          <div className="border-b pb-2">
            <label className="text-sm font-medium text-gray-600">Email:</label>
            <p className="text-gray-800">{session.user?.email}</p>
          </div>
          <div className="border-b pb-2">
            <label className="text-sm font-medium text-gray-600">Name:</label>
            <p className="text-gray-800">{session.user?.name}</p>
          </div>
          <div className="border-b pb-2">
            <label className="text-sm font-medium text-gray-600">ID:</label>
            <p className="text-gray-800">{session.user?.id}</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t">
          <form action={logoutAction}>
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
