import React from "react";

import { APIQuery } from "../api";
import { Questions } from "../questions";

export const Quiz = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const qID = urlParams.has("question") ? urlParams.get("question") : "Q1";

  const Success = ({ data }) => {
    const existingAnswer = data.find(({ questionId }) => questionId === qID);
    return (
      <Questions
        answer={existingAnswer ? existingAnswer.answer : ""}
        questionId={qID}
        edit={!!existingAnswer}
      />
    );
  };
  return (
    <APIQuery
      path={"/api/questions"}
      LoadingState={() => <span>Loading answers</span>}
      ErrorState={() => <span>Failed to fetch</span>}
      SuccessState={Success}
    />
  );
};
