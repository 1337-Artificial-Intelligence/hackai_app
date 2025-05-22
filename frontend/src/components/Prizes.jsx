import React from "react";

export default function Prizes() {
  // return (
  //   <div className="my-8 mx-auto w-full lg:my-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-lg py-8 px-6 shadow-lg">
  //     <div className="mx-auto mb-8 w-full lg:mb-16 text-center">
  //       <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
  //         🎉 Prizes to be announced soon! Stay tuned for exciting updates. 🎁
  //       </p>
  //     </div>
  //   </div>
  // );
  // }
  return (
    <div className="my-8 mx-auto w-full lg:my-10 bg-neutral-950 rounded-md py-6 md:px-6 px-3">
      <div className="mx-auto mb-8 w-full lg:mb-16">
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
        </p>
      </div>
      <div className="grid gap-8 lg:gap-12 sm:grid-cols-1 lg:grid-cols-3 px-4 max-w-7xl mx-auto">
        {/* 2nd Place */}
        <div className="relative  h-fit mt-5 text-center lg:order-1 order-2 bg-gradient-to-b from-gray-300/20 to-transparent p-8 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
          <div className="absolute  top-0 left-1/2 -translate-x-1/2 -mt-6 text-4xl">🥈</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-4">2nd Place</h3>
          <div className="text-3xl font-extrabold text-gray-100 mb-4">
             12,000 MAD
          </div>
        </div>

        {/* 1st Place */}
        <div className="relative  h-fit text-center -mt-5 mb-5 lg:order-2 order-1 bg-gradient-to-b from-yellow-500/20 to-transparent p-8 rounded-2xl border border-yellow-500 shadow-lg transform lg:scale-105 z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 text-4xl">🏆</div>
          <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
            1st Place
          </h3>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
             20,000 MAD
          </div>
        </div>

        {/* 3rd Place */}
        <div className="relative  h-fit mt-14 text-center lg:order-3 order-3 bg-gradient-to-b from-amber-600/20 to-transparent p-8 rounded-2xl border border-amber-600 dark:border-amber-500 shadow-lg dark:shadow-amber-800/20">
          <div className="absolute  top-0 left-1/2 -translate-x-1/2 -mt-6 text-4xl">🥉</div>
          <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-4">
            3rd Place
          </h3>
          <div className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
             8,000 MAD
          </div>
        </div>
      </div>
    </div>
  );
}
