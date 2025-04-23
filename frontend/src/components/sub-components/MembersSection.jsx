const MembersSection = ({ title, children }) => {
  return (
    <div className="my-8  mx-auto  rounded-md w-full lg:my-10 dark:bg-neutral-950 py-7">
      <div className="mx-auto mb-8 w-full lg:mb-16">
        <h2 className="mb-4 text-4xl text-center w-full tracking-tight font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex gap-8 lg:gap-10 flex-wrap justify-center items-center px-4 sm:px-6 md:px-10">
        {children}
      </div>
    </div>
  );
};

export default MembersSection;
