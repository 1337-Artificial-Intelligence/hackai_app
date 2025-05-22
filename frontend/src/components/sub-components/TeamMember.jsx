import React from "react";

export default function TeamMember({ img, name, role }) {
  return (
    <div class="text-center text-gray-500 dark:text-gray-400 w-60">
      <img
        class="mx-auto mb-4 md:w-24 md:h-24 w-16 h-16 rounded-full object-cover object-center"
        src={img}
        alt="Bonnie Avatar"
      />
      <h3 class="mb-1 md:text-xl text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        <div href="#">{name}</div>
      </h3>
      <p className="text-wrap">{role}</p>
    </div>
  );
}
