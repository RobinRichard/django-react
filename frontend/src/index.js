import React from "react";
import ReactDOM from "react-dom";

import "regenerator-runtime/runtime";

import { Answers } from "./answers";
import { Quiz } from "./Quiz";

const _answers = document.getElementById("answers");
if (_answers) ReactDOM.render(<Answers />, _answers);

const _questions = document.getElementById("questions");
if (_questions) ReactDOM.render(<Quiz />, _questions);
