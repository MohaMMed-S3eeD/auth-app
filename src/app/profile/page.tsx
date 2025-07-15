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
    <div className="min-h-screen bg-gradient-to-br from-black/100  to-black/80 flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6">
          <h1 className="text-2xl font-semibold text-white text-center mb-6">
            Profile
          </h1>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/15 backdrop-blur-lg rounded-full p-2 border border-white/25">
              <Image
                src={session.user?.image || "/user.svg"}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-white/80 mb-1 font-medium">
                Name
              </label>
              <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-lg p-3">
                <p className="text-white">{session.user?.name || "N/A"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1 font-medium">
                Email
              </label>
              <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-lg p-3">
                <p className="text-white text-sm">{session.user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1 font-medium">
                User ID
              </label>
              <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-lg p-3">
                <p className="text-white/90 text-xs font-mono">
                  {session.user?.id}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1 font-medium">
                Email Verified
              </label>
              <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-lg p-3">
                <p className="text-white/90 text-xs font-mono">
                  {session.user?.emailVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full bg-red-500/80 backdrop-blur-lg hover:bg-red-500/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-red-400/30"
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
