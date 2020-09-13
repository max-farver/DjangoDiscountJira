import React, { useState, useEffect, useRef, useContext } from "react";
import useOnClickOutside from "../utils/useOnClickOutside";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import authenticatedFetch from "../utils/authenticatedFetch.js";

const AddProjectForm = ({ projects, setProjects }) => {
  const nameRef = useRef();
  const { user, setUser } = useContext(UserContext);

  const addNewProject = async (e) => {
    e.preventDefault();
    const newProject = await authenticatedFetch(
      `https://discount-jira.herokuapp.com//projects/`,
      "POST",
      user,
      setUser,
      {
        name: nameRef.current.value,
      }
    );
    setProjects([...projects, newProject]);
    nameRef.current.value = "";
  };

  return (
    <form onSubmit={(e) => addNewProject(e)}>
      <label htmlFor="newProject" className="sr-only">
        Add new project
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <input
            id="newProject"
            name="newProject"
            ref={nameRef}
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder="Create a New Project."
          />
        </div>
        <button
          type="submit"
          className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-yellow-300 hover:text-gray-500 hover:bg-yellow-200 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-700 w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

const ProjectCard = ({ project, gridIndex }) => {
  const menuRef = useRef();
  const [menuIsShowing, setMenuIsShowing] = useState(false);
  useOnClickOutside(menuRef, () => setMenuIsShowing(false));
  return (
    <div
      to={`/${project.id}`}
      className="relative col-span-1 flex shadow-sm rounded-md border-t border-r border-b border-gray-200 bg-white rounded-md"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-4 bg-red-600 border-red-600 border uppercase text-white text-sm leading-5 font-medium rounded-l-md"></div>
      <Link
        to={`/${project.id}`}
        className="flex-1 flex items-center justify-between"
      >
        <div className="flex-1 px-4 py-2 text-md leading-5 truncate">
          <h3 className="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
            {project.name}
          </h3>
          <p className="text-gray-500 text-sm">
            {project.members.length} Members
          </p>
        </div>
      </Link>
      <div className="flex-shrink-0 pr-2 z-100 self-center">
        <button
          id="pinned-project-options-menu-0"
          onClick={() => setMenuIsShowing(true)}
          className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        <div
          ref={menuRef}
          className={`${
            menuIsShowing ? "block" : "hidden"
          } z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg`}
        >
          <div
            className="rounded-md bg-white shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="pinned-project-options-menu-0"
          >
            <div className="py-1">
              <button
                onClick={() => null}
                className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                role="menuitem"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectList = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const proj = await authenticatedFetch(
        "https://discount-jira.herokuapp.com//projects/",
        "GET",
        user,
        setUser
      );
      setProjects(proj || []);
    };
    getProjects();
  }, [user, setUser]);

  if (user === null) {
    history.push("/login");
  }

  return (
    user && (
      <>
        <h1 className="text-3xl font-bold mb-4">Projects</h1>
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, gridIndex) => (
            <ProjectCard
              project={project}
              gridIndex={gridIndex}
              key={project.id}
            />
          ))}
          <AddProjectForm projects={projects} setProjects={setProjects} />
        </div>
      </>
    )
  );
};

export default ProjectList;
