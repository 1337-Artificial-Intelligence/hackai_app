import React from "react";

export default function Prizes() {
  return (
    <div className="my-8 mx-auto w-full lg:my-10 dark:bg-neutral-950 rounded-md py-6 md:px-6 px-3">
      <div className="mx-auto mb-8 w-full lg:mb-16">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Compete for amazing prizes and recognition! The top three teams will
          receive exclusive rewards, mentorship opportunities, and platform
          credits to boost their projects.
        </p>
      </div>
      <div className="grid gap-8 lg:gap-12 sm:grid-cols-1 lg:grid-cols-3 px-4 max-w-7xl mx-auto">
        {/* 2nd Place */}
        <div className="relative lg:order-1 order-2 bg-gradient-to-b from-gray-300/20 to-transparent p-8 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
          <div className="absolute top-0 right-4 -mt-6 text-4xl">🥈</div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            2nd Place
          </h3>
          <div className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            $5,000
          </div>
        </div>

        {/* 1st Place */}
        <div className="relative lg:order-2 order-1 bg-gradient-to-b from-yellow-500/20 to-transparent p-8 rounded-2xl border border-yellow-500 shadow-lg transform lg:scale-105 z-10">
          <div className="absolute top-0 right-4 -mt-6 text-4xl">🏆</div>
          <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
            1st Place
          </h3>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            $10,000
          </div>
        </div>

        {/* 3rd Place */}
        <div className="relative lg:order-3 order-3 bg-gradient-to-b from-amber-600/20 to-transparent p-8 rounded-2xl border border-amber-600 dark:border-amber-500 shadow-lg dark:shadow-amber-800/20">
          <div className="absolute top-0 right-4 -mt-6 text-4xl">🥉</div>
          <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-4">
            3rd Place
          </h3>
          <div className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            $2,500
          </div>
        </div>
      </div>
    </div>
  );
}
