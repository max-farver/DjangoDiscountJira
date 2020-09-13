import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import authenticatedFetch from "../utils/authenticatedFetch";
// import useOnClickOutside from "../utils/useOnClickOutside";

// Fake Data
// const getItems = (count, offset = 0) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k + offset}-${new Date().getTime()}`,
//     name: `item ${k + offset}`,
//   }));

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

// const MiniMenu = (todo) => {
//   const [showing, setShowing] = useState(false);

//   const toggleShowing = () => setShowing((prev) => !prev);

//   return (
//     <div className="ml-2 relative">
//       <button
//         onClick={toggleShowing}
//         className="h-6 w-6 p-2 rounded-md flex flex-col items-center justify-center hover:bg-orange-100"
//       >
//         =
//       </button>
//       <ul
//         hidden={!showing}
//         className="absolute z-50 -top-10 -right-20 rounded-md h-20 w-32 p-2 text-white text-sm tracking-wide bg-gray-700"
//       >
//         <li>
//           <button onCLick={() => null}>Delete Task</button>
//         </li>
//         <li>Temporary</li>
//         <li>Temporary</li>
//       </ul>
//     </div>
//   );
// };

const TodoItem = ({ todo, todoIndex, stageIndex, provided, deleteTask }) => {
  // const menuRef = useRef();
  // const [menuIsShowing, setMenuIsShowing] = useState(false);
  // useOnClickOutside(menuRef, () => setMenuIsShowing(false));
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="relative col-span-1 flex shadow-sm rounded-md"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-2 bg-red-600 uppercase text-white text-sm leading-5 font-medium rounded-l-md"></div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 flex px-4 py-2 text-sm leading-5 truncate">
          <h4 className="text-gray-900 font-medium transition ease-in-out duration-150">
            {todo.name}
          </h4>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            id="pinned-project-options-menu-0"
            onClick={(e) => deleteTask(e, todo.id, todoIndex, stageIndex)}
            className="w-8 h-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition ease-in-out duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 hover:text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
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

  useEffect(() => {
    const getProjects = async () => {
      const todos = await authenticatedFetch(
        `https://discount-jira.herokuapp.com/projects/${projectId}/todos/`,
        "GET",
        user,
        setUser
      );

      const newBoard = stageValues.map((stage) =>
        todos.filter((todo) => todo.stage === stage)
      );

      setBoard(newBoard);
    };
    getProjects();
  }, [projectId, setUser, user]);

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
