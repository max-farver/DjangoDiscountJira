import React, { useState, useRef } from "react";
import Layout from "./Layout";
import useOnClickOutside from "../utils/useOnClickOutside";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, gridIndex }) => {
  const menuRef = useRef();
  const [menuIsShowing, setMenuIsShowing] = useState(false);
  useOnClickOutside(menuRef, () => setMenuIsShowing(false));
  return (
    <Link
      to={`/${project.id}`}
      class="relative col-span-1 flex shadow-sm rounded-md"
    >
      <div class="flex-shrink-0 flex items-center justify-center w-16 bg-red-600 uppercase text-white text-sm leading-5 font-medium rounded-l-md">
        {project.owner}
      </div>
      <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div class="flex-1 px-4 py-2 text-sm leading-5 truncate">
          <a
            href="#"
            class="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150"
          >
            {project.name}
          </a>
          <p class="text-gray-500">{project.members.length} Members</p>
        </div>
        <div class="flex-shrink-0 pr-2">
          <button
            id="pinned-project-options-menu-0"
            onClick={() => setMenuIsShowing(true)}
            aria-has-popup="true"
            class="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
          >
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          <div
            ref={menuRef}
            class={`${
              menuIsShowing ? "block" : "hidden"
            } z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg`}
          >
            <div
              class="rounded-md bg-white shadow-xs"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="pinned-project-options-menu-0"
            >
              <div class="py-1">
                <button
                  onClick={() => null}
                  class="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "project1",
      owner: "test",
      members: ["one", "two"],
    },
    {
      id: 2,
      name: "project2",
      owner: "test2",
      members: ["one", "two"],
    },
    {
      id: 3,
      owner: "test3",
      name: "project3",
      members: ["one", "two"],
    },
    {
      id: 4,
      name: "project4",
      owner: "test4",
      members: ["one", "two"],
    },
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, gridIndex) => (
          <ProjectCard project={project} gridIndex={gridIndex} />
        ))}
      </div>
    </>
  );
};

export default ProjectList;
