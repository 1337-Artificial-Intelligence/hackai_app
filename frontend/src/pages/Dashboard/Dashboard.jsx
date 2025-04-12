import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MdLeaderboard } from "react-icons/md";
import { ArrowLeftIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="dark min-h-screen pb-10 bg-black md:px-6 px-3">
      <nav className="bg-black  w-full py-3 flex justify-between relative z-10 top-0 items-center">
        <div className="max-w-7xl w-full  mx-auto flex justify-between items-center">
          <img src="/assets/logo.jpg" className="md:w-48 w-36" alt="" />

          <Link
            to="/"
            className="inline-flex gap-2 md:h-12 h-9 font-extrabold animate-shimmer text-white items-center hover:underline cursor-pointer justify-center rounded-md  "
          >
            <ArrowLeftIcon size={18} className="text-xl" />
            Back to home
          </Link>
        </div>
      </nav>
      <div className="w-full mt-12  bg-black max-w-7xl  mx-auto dark">
        <Outlet />
      </div>
    </div>
  );
}
