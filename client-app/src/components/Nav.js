import React, { useContext, useState, useRef } from "react";
import { UserContext, ProjectContext } from "../App";
import { Link } from "react-router-dom";
import useOnClickOutside from "../utils/useOnClickOutside";

const Nav = () => {
  const { user, setUser } = useContext(UserContext);
  const { project, setProject } = useContext(ProjectContext);
  const profileRef = useRef();
  const [profileMenuIsShowing, setProfileMenuIsShowing] = useState(false);
  useOnClickOutside(profileRef, () => setProfileMenuIsShowing(false));

  const logout = () => setUser(null);

  return (
    <nav className="bg-red-800 shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          <Link
            to="/"
            className="tracking-wide text-2xl font-bold text-white flex flex-col items center justify-center"
          >
            DiscountJira
          </Link>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {project && (
              <Link to={`/${project}/settings`} className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            )}
            <div className="relative">
              <div>
                <button
                  className="flex justify-between items-center text-md text-white tracking-wide border-2 border-transparent rounded-full p-2 focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                  id="user-menu"
                  aria-label="User menu"
                  aria-haspopup="true"
                  onClick={() => setProfileMenuIsShowing((prev) => !prev)}
                >
                  <span className="mr-2">{user && user.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5 text-white"
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
              <div
                ref={profileRef}
                className={`${
                  profileMenuIsShowing ? "block" : "hidden"
                } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg`}
              >
                <div
                  className="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  {user ? (
                    <button
                      onClick={logout}
                      className="w-full text-left cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
