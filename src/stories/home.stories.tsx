import Home from "../components/home.tsx";
import React from "react";

export const Default = {
  render: () => {
    return (
      <div>
        <Home />
      </div>
    );
  },
};

export default {
  title: "Tempo/Default",
  component: Home,
};
