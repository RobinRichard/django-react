import React, { useState } from "react";
import { useMutation } from "../api/mutations";
import { useCookies } from "react-cookie";
import { Mapper } from "./mapper";

import { QUESTION_LIST } from "../data";

export const Questions = ({ answer, questionId, edit }) => {
  const [cookies] = useCookies(["csrftoken"]);
  const options = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.csrftoken,
    },
    method: "POST",
    validStatusCodes: [200, 201],
  };

  const [{ loading, error }, { fire }] = useMutation({ options });

  const question = QUESTION_LIST.find(({ id }) => id === questionId);
  if (!question)
    return (
      <div className={"container mt-5"}>
        <p>Return 404 page here</p>
        <h5>Invalid question {questionId}</h5>
      </div>
    );

  const qIndex = QUESTION_LIST.findIndex(({ id }) => id === questionId);
  const [value, setValue] = useState({ [question.id]: answer });
  const [isEdit, setIsEdit] = useState(edit);

  const handleChange = (id, value) => {
    setValue({ ...value, [id]: value });
  };

  const handleSubmit = () => {
    fire("api/questions/", {
      body: JSON.stringify({
        questionId: question.id,
        answer: value[question.id],
      }),
    });
    setIsEdit(true);
  };

  const Next = () => {
    const nextIndex = qIndex + 1;
    if (QUESTION_LIST.length > nextIndex) {
      const nextQuestion = QUESTION_LIST[nextIndex];
      return (
        <a
          className={"btn btn-warning"}
          href={`${window.location.pathname}?question=${nextQuestion.id}`}>
          Next
        </a>
      );
    }
    return (
      <a type="button" className="btn btn-success" href={"/answers"}>
        Finish
      </a>
    );
  };

  const Previous = () => {
    const prevIndex = qIndex - 1;

    if (prevIndex >= 0) {
      const prevQuestion = QUESTION_LIST[prevIndex];
      return (
        <a
          className={"btn btn-warning"}
          href={`${window.location.pathname}?question=${prevQuestion.id}`}>
          Previous
        </a>
      );
    }
    return null;
  };

  return (
    <div className={"container"}>
      <div className="row justify-content-md-center">
        <div className="col col-lg-6">
          <h2 className={"mt-2 mb-3"}>Quiz</h2>
          <hr />
          <div className={"d-flex justify-content-end"}>
            <div className={"p-1"}>
              <Previous />
            </div>
            <div className={"p-1"}>
              <Next />
            </div>
          </div>
          <Mapper
            value={value}
            index={qIndex + 1}
            handleChange={handleChange}
            {...question}
          />
          {!loading ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}>
              {isEdit ? "Update" : "Save"}
            </button>
          ) : (
            "Saving..."
          )}
        </div>
        {error && <code>{error}</code>}
      </div>
    </div>
  );
};
