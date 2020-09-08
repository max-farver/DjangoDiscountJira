import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import useOnClickOutside from "../utils/useOnClickOutside";

const Nav = () => {
  const { user, setUser } = useContext(UserContext);
  const profileRef = useRef();
  const [profileMenuIsShowing, setProfileMenuIsShowing] = useState(false);
  useOnClickOutside(profileRef, () => setProfileMenuIsShowing(false));

  return (
    <nav class="bg-red-800 shadow">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex justify-between h-16">
          <Link
            to="/"
            className="tracking-wide text-2xl font-bold text-white flex flex-col items center justify-center"
          >
            DiscountJira
          </Link>
          <div class="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <div class="relative">
              <div>
                <button
                  class="flex justify-between items-center text-md text-white tracking-wide border-2 border-transparent rounded-full p-2 focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                  id="user-menu"
                  aria-label="User menu"
                  aria-haspopup="true"
                  onClick={() => setProfileMenuIsShowing((prev) => !prev)}
                >
                  {user.username}mfarver
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5 text-white ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
              </div>

              {/* Profile dropdown panel, show/hide based on dropdown state.

            Entering: "transition ease-out duration-200"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95" */}

              <div
                ref={profileRef}
                class={`${
                  profileMenuIsShowing ? "block" : "hidden"
                } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg`}
              >
                <div
                  class="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // return (
  //   <nav className="bg-red-700 p-4 md:px-10 flex justify-between items-center">
  //     <Link to="/">
  //       <h1 className="text-2xl font-bold text-white tracking-wide uppercase">
  //         Discount Jira
  //       </h1>
  //     </Link>
  //     <div className="flex space-x-10 items-center">
  //       {user.username ? (
  //         <Link
  //           onClick={() =>
  //             setUser({
  //               username: null,
  //               access: null,
  //               refresh: null,
  //             })
  //           }
  //           className="px-4 py-2 font-bold tracking-wide bg-white text-red-900 rounded-md hover:shadow-md"
  //         >
  //           Logout
  //         </Link>
  //       ) : (
  //         <Link
  //           to="/login"
  //           className="block px-4 py-2 font-bold tracking-wide bg-white text-red-900 rounded-md hover:shadow-md"
  //         >
  //           Login
  //         </Link>
  //       )}
  //     </div>
  //   </nav>
  // );
};

export default Nav;
