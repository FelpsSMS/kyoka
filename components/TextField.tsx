import { ErrorMessage, useField } from "formik";
import React from "react";

export const TextField = (props) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <label className="font-normal text-xl" htmlFor={field.name}>
        {props.label}
      </label>
      <input
        className={`${
          props.type === "file"
            ? ""
            : `rounded-lg bg-gray-200 text-xl p-2 outline-none  ${
                meta.error
                  ? "border-2 border-red-700"
                  : "focus:border-2 border-black"
              }`
        }`}
        {...field}
        {...props}
      />
      <ErrorMessage
        component="div"
        name={field.name}
        className="text-red-700"
      />
    </div>
  );
};
