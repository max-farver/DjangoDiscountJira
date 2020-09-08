import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Fake Data
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    name: `item ${k + offset}`,
  }));

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

const deleteTask = (taskId) => {};

const MiniMenu = (todo) => {
  const [showing, setShowing] = useState(false);

  const toggleShowing = () => setShowing((prev) => !prev);

  return (
    <div className="ml-2 relative">
      <button
        onClick={toggleShowing}
        className="h-6 w-6 p-2 rounded-md flex flex-col items-center justify-center hover:bg-orange-100"
      >
        =
      </button>
      <ul
        hidden={!showing}
        className="absolute -top-10 -right-20 rounded-md h-20 w-32 p-2 text-white text-sm tracking-wide bg-gray-700 opacity-95"
      >
        <li>{/* <button onCLick={() => null}>Delete Task</button> */}lksjd</li>
        <li>Temporary</li>
        <li>Temporary</li>
      </ul>
    </div>
  );
};

const TodoItem = ({ todo, todoIndex, stageIndex, provided }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={`${todo.id}-${stageIndex}-${todoIndex}`}
      className="flex justify-between items-center p-2 cursor-pointer bg-orange-400 rounded-md hover:shadow-sm hover:bg-orange-300 transition-all duration-100"
    >
      <h3 className="leading-5">{todo.name}</h3>
      <MiniMenu />
    </div>
  );
};

const DeskopView = () => {
  const stageNames = [
    "Backlog",
    "UpNext",
    "InProgress",
    "NeedsReview",
    "InReview",
    "Complete",
  ];

  const [board, setBoard] = useState([
    getItems(5),
    getItems(5, 5),
    getItems(5, 10),
    getItems(5, 15),
    getItems(5, 20),
    getItems(5, 25),
  ]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    console.log("Source: ", source);

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

      setBoard(newState.filter((group) => group.length));
    }

    // call PUT method for the todoItem to update STAGE
  };

  // const addNewTask = (e, stageIndex) => {
  //   e.preventDefault();
  // };

  // const deleteTask = (e, task) => {
  //   e.preventDefault();
  // };

  return (
    <div className="flex space-x-1 h-full w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        {board.map((stage, stageIndex) => (
          <Droppable key={stageIndex} droppableId={`${stageIndex}`}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                className="w-full h-full flex-col space-y-2 rounded-md hover:bg-gray-100 hover:shadow-xl transition-all duration-200 p-2"
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
                      />
                    )}
                  </Draggable>
                ))}
                <form
                  onSubmit={(e) => addNewTask(e, stageIndex)}
                  className="flex justify-between items-center p-2 cursor-pointer bg-blue-300 rounded-md hover:shadow-sm  transition-all duration-100"
                >
                  <input
                    type="text"
                    className="px-2 py-1 bg-blue-300 rounded-t-md border-b border-gray-700 focus:bg-blue-200 hover:bg-blue-200 transition-all duration-200 outline-none"
                  />
                  <button
                    type="submit"
                    className="h-6 w-6 rounded-md hover:bg-blue-200"
                  >
                    +
                  </button>
                </form>
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DeskopView;
