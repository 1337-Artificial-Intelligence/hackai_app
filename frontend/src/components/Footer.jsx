import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center flex justify-between items-center p-4 w-full flex-wrap border-t bottom-1 border-gray-200">
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {/* <p>© 2025 All rights reserved.</p> */}
        <a href="/" className="hover:underline font-bold">
          Developed with ❤️ by  Issam Laafar and Mossaab Amimar
        </a>
      </div>
      <div className="flex justify-center items-center font-bold underline gap-2 mt-2">
        <a href="/about-us" className="hover:underline">
          {/* About Us */}
        </a>
        <a href="/contact" className="hover:underline">
          {/* Contact */}
        </a>
        <a href="/faq" className="hover:underline">
          {/* FAQ */}
        </a>
      </div>
    </footer>
  );
}
