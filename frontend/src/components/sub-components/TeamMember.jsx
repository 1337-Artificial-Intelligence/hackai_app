import React from "react";

export default function TeamMember({ img, name, role }) {
  return (
    <div class="text-center text-gray-500 dark:text-gray-400">
      <img
        class="mx-auto mb-4 w-24 h-24 rounded-full"
        src={img}
        alt="Bonnie Avatar"
      />
      <h3 class="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        <a href="#">{name}</a>
      </h3>
      <p>{role}</p>
    </div>
  );
}
