import { ErrorMessage, useField } from "formik";
import React from "react";

export const TextArea = (props) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <label className="font-normal text-xl" htmlFor={field.name}>
        {props.label}
      </label>
      <textarea
        className={`rounded-lg text-2xl overflow-scroll outline-none focus:border-2 border-black p-2 h-32 md:h-40 ${
          props.readOnly ? "bg-gray-400" : "bg-gray-200"
        }`}
        {...field}
        {...props}
      />
    </div>
  );
};
