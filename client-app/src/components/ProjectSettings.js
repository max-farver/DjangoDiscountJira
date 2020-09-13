import React, { useContext, useRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import authenticatedFetch from "../utils/authenticatedFetch";
import { UserContext } from "../App";

const ProjectName = ({ project, setProject, user, setUser, projectId }) => {
  const ref = useRef();
  const [isEditable, setIsEditable] = useState(false);
  const [projectName, setProjectName] = useState(" ");
  useEffect(() => {
    const getProjects = async () => {
      const project = await authenticatedFetch(
        `https://discount-jira.herokuapp.com/projects/${projectId}/`,
        "GET",
        user,
        setUser
      );
      setProject(await project);
      setProjectName(await project.name);
    };
    getProjects();
  }, [user, setUser, setProject, setProjectName, projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditable(false);
    const updateName = async () => {
      const changedProject = await authenticatedFetch(
        `https://discount-jira.herokuapp.com/projects/${projectId}/`,
        "PUT",
        user,
        setUser,
        {
          id: projectId,
          name: ref.current.value,
        }
      );

      setProject(await changedProject);
      setProjectName(await changedProject.name);
    };
    updateName();
  };

  if (isEditable) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center"
      >
        <input
          type="text"
          ref={ref}
          defaultValue={projectName}
          className="text-center text-4xl font-bold text-red-800 underline w-auto"
        />
        <button
          name="save"
          type="submit"
          className="text-sm ml-4 rounded-sm shadow-md bg-yellow-300 px-2 py-1"
        >
          save
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-4xl font-bold text-red-800">
        {projectName}
      </h1>
      <button
        onClick={() => setIsEditable((prev) => !prev)}
        className="text-sm ml-4 rounded-sm shadow-md bg-yellow-300 px-2 py-1"
      >
        edit
      </button>
    </div>
  );
};

const AddUserForm = () => {
  const nameRef = useRef();

  return (
    <form onSubmit={(e) => null}>
      <label htmlFor="newMember" className="sr-only">
        Add new member
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <input
            id="newMember"
            name="newMember"
            ref={nameRef}
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder="Username"
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

const ProjectSettings = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const deleteProject = async () => {
    await authenticatedFetch(
      `https://discount-jira.herokuapp.com/projects/${projectId}/`,
      "DELETE",
      user,
      setUser
    );

    history.push("/");
  };
  return (
    <>
      <ProjectName {...{ project, setProject, user, setUser, projectId }} />
      <div className="h-full w-full flex flex-col items-center mt-10">
        <div className="h-72 flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-6">
          {/* Add new member */}
          <div>
            <h2 className="text-xl font-bold">Add a Member</h2>
            <AddUserForm />
          </div>
          <button
            onClick={deleteProject}
            className="bg-red-700 hover:bg-red-600 text-white font-bold uppercase rounded-md p-4 text-2xl shadow-lg"
          >
            Delete Project
          </button>
          {/* Member list - can delete */}
          {project?.members &&
            Array.isArray(project.members) &&
            project.members.map((member) => <p>{member?.username}</p>)}
        </div>
      </div>
    </>
  );
};

export default ProjectSettings;
