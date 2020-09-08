import Head from "next/head";
import Layout from "../components/Layout";
import { isTablet, isMobile } from "react-device-detect";
import MobileView from "../components/MobileView";
import DeskopView from "../components/DeskopView";

export default function Home() {
  if (isTablet || isMobile) {
    return (
      <Layout>
        <MobileView />
      </Layout>
    );
  }

  return (
    <Layout>
      <DeskopView />
    </Layout>
  );
}
