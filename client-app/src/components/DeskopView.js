import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams, useHistory } from "react-router-dom";
import Modal from "react-modal";
import { UserContext, ProjectContext } from "../App";
import authenticatedFetch from "../utils/authenticatedFetch";

// ------- for drag-n-drop ---------
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
// ---------------------------------

const TodoItem = ({
  todo,
  todoIndex,
  stageIndex,
  provided,
  deleteTask,
  board,
  setBoard,
}) => {
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);
  const nameRef = useRef();
  const descRef = useRef();
  const [editIsShowing, setEditIsShowing] = useState(false);

  const handleChanges = async (e) => {
    e.preventDefault();
    const newTodo = await authenticatedFetch(
      `https://discount-jira.herokuapp.com/projects/${projectId}/todos/${todo.id}/`,
      "PUT",
      user,
      setUser,
      {
        id: todo.id,
        name: nameRef.current.value,
        description: descRef.current.value,
      }
    );

    const newState = [...board];

    newState[stageIndex][todoIndex] = newTodo;
    setBoard(newState);

    setEditIsShowing(false);
  };
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="relative col-span-1 flex shadow-sm rounded-md max-w-full"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-2 bg-red-600 uppercase text-white text-sm leading-5 font-medium rounded-l-md"></div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
        <div
          className="flex-1 flex px-4 py-2 text-sm leading-5"
          onClick={() => setEditIsShowing(true)}
        >
          <h4 className="text-gray-900 break-normal max-w-full font-medium transition ease-in-out duration-150">
            {todo.name}
          </h4>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            onClick={(e) => deleteTask(e, todo.id, todoIndex, stageIndex)}
            className="w-8 h-8 p-2 items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-full h-full"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <Modal isOpen={editIsShowing}>
        <form
          onSubmit={(e) => handleChanges(e)}
          className="mt-16 mx-auto max-w-2xl"
        >
          <div>
            <label
              for="name"
              class="block text-sm font-medium leading-5 text-gray-700"
            >
              Name
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                id="name"
                ref={nameRef}
                defaultValue={todo.name}
                class="form-input block w-full sm:text-sm sm:leading-5"
              />
            </div>
          </div>
          <div className="mt-8">
            <label
              for="description"
              class="block text-sm font-medium leading-5 text-gray-700"
            >
              Description
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <textarea
                id="description"
                ref={descRef}
                class="form-input block w-full sm:text-sm sm:leading-5"
                defaultValue={todo.description}
                placeholder="Enter a description here"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setEditIsShowing(false)}
              className="flex-grow-0 flex justify-center ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-gray-900 focus:shadow-outline-red active:bg-gray-700 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-grow-0 flex justify-center ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const AddTaskForm = ({ stage, stageIndex, board, setBoard }) => {
  const nameRef = useRef();
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);

  const addNewTask = async (e, stageIndex) => {
    e.preventDefault();
    const task = await authenticatedFetch(
      `https://discount-jira.herokuapp.com/projects/${projectId}/todos/`,
      "POST",
      user,
      setUser,
      {
        name: nameRef.current.value,
        stage: stage,
      }
    );
    const newState = [...board];
    newState[stageIndex].push(task);
    setBoard(newState);

    nameRef.current.value = "";
  };

  return (
    <form onSubmit={(e) => addNewTask(e, stageIndex)}>
      <label htmlFor="newTask" className="sr-only">
        Add new task
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <input
            id="newTask"
            name="newTask"
            ref={nameRef}
            className="form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder="User can..."
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

const stageNames = [
  "Backlog",
  "Up Next",
  "In Progress",
  "Needs Review",
  "In Review",
  "Complete",
];

const stageValues = [
  "Backlog",
  "UpNext",
  "InProgress",
  "NeedsReview",
  "InReview",
  "Complete",
];
const DeskopView = () => {
  const { projectId } = useParams();
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [board, setBoard] = useState([]);
  const { project, setProject } = useContext(ProjectContext);

  useEffect(() => setProject(projectId), []);

  useEffect(() => {
    const getProjects = async () => {
      const todos = await authenticatedFetch(
        `https://discount-jira.herokuapp.com/projects/${projectId}/todos/`,
        "GET",
        user,
        setUser
      );

      if (todos === null) {
        history.push("/login");
      } else if (Array.isArray(todos)) {
        const newBoard = stageValues.map((stage) =>
          todos.filter((todo) => todo.stage === stage)
        );

        setBoard(newBoard);
      }
    };
    getProjects();
  }, [projectId, setUser, user, history]);

  if (user === null) {
    history.push("/login");
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(board[sInd], source.index, destination.index);
      const newState = [...board];
      newState[sInd] = items;
      setBoard(newState);
    } else {
      const result = move(board[sInd], board[dInd], source, destination);
      const newState = [...board];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      newState[dInd][destination.index].stage = stageValues[dInd];
      updateTask(newState[dInd][destination.index]);
      setBoard(newState);
    }
  };

  const updateTask = (task) => {
    authenticatedFetch(
      `https://discount-jira.herokuapp.com/projects/${projectId}/todos/${task.id}/`,
      "PUT",
      user,
      setUser,
      {
        id: task.id,
        stage: task.stage,
        name: task.name,
      }
    );
  };

  const deleteTask = (e, taskId, taskIndex, stageIndex) => {
    e.preventDefault();
    authenticatedFetch(
      `https://discount-jira.herokuapp.com/projects/${projectId}/todos/${taskId}/`,
      "DELETE",
      user,
      setUser
    );

    const newState = [...board];

    newState[stageIndex].splice(taskIndex, 1);
    setBoard(newState);
  };

  return (
    <div className="flex space-x-1 overflow-x-scroll h-full w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        {board.map((stage, stageIndex) => (
          <Droppable key={stageIndex} droppableId={`${stageIndex}`}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                className="max-w-xs w-full h-full flex-shrink-0 flex-col space-y-2 rounded-md hover:bg-gray-100 hover:shadow-xl transition-all duration-200 p-2"
                {...provided.droppableProps}
              >
                <h2 className="text-center text-lg font-bold uppercase">
                  {stageNames[stageIndex]}
                </h2>
                {/* <Container> */}
                {stage.map((todo, todoIndex) => (
                  <Draggable
                    key={`${todo.id}`}
                    draggableId={`${todo.id}`}
                    index={todoIndex}
                  >
                    {(provided, snapshot) => (
                      <TodoItem
                        todo={todo}
                        todoIndex={todoIndex}
                        stageIndex={stageIndex}
                        provided={provided}
                        deleteTask={deleteTask}
                        board={board}
                        setBoard={setBoard}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <AddTaskForm
                  stageIndex={stageIndex}
                  user={user}
                  setUser={setUser}
                  projectId={projectId}
                  board={board}
                  setBoard={setBoard}
                  stage={stageValues[stageIndex]}
                />
              </section>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DeskopView;
