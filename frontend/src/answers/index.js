import React from "react";

import { APIQuery } from "../api";
import { QUESTION_LIST } from "../data";

export const Answers = () => {
  const Success = ({ data }) => {
    const answers = QUESTION_LIST.map(({ id, text }, idx) => {
      const _ans = data.find(a => a.questionId === id);
      return (
        <dl key={idx} className={"font-weight-bold"}>
          <dt>
            {idx + 1} . {text}
          </dt>
          <dd className={"text-success font-weight-light"}>
            {_ans ? _ans.answer : "Not answered"}
          </dd>
        </dl>
      );
    });
    return (
      <div className={"container col-xs-6 col-xs-offset-2 mt-4"}>
        <div className="row justify-content-md-center">
          <div className="col col-lg-6">
            <h3>Answers</h3>
            <hr />
            {answers}
          </div>
        </div>
      </div>
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
