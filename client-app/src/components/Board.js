import React from "react";
import { isTablet, isMobile } from "react-device-detect";
import Layout from "./Layout";
import MobileView from "./MobileView";
import DeskopView from "./DeskopView";

const Board = () => {
  if (isTablet || isMobile) {
    return <MobileView />;
  }
  return <DeskopView />;
};

export default Board;
