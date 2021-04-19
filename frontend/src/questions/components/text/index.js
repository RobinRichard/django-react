import React from "react";

export const Text = ({ id, index, text, value, handleChange }) => {
  const onTextChange = e => {
    handleChange(id, e.target.value);
  };
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {index}. {text}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        onChange={onTextChange}
        name={id}
        value={value.hasOwnProperty(id) ? value[id] : ""}
      />
    </div>
  );
};
