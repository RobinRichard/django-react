import React from "react";
import { Text } from "./components/text";

export const Mapper = ({ type, ...rest }) => {
  switch (type) {
    case "input":
      return <Text {...rest} />;
    default:
      return null;
  }
};
