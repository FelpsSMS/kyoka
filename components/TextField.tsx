import { ErrorMessage, useField } from "formik";
import React, { useEffect } from "react";

export const TextField = (props) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <label className="font-normal text-xl" htmlFor={field.name}>
        {props.label}
      </label>
      <input
        //ref={props.ref}
        className={`${
          props.type === "file"
            ? ""
            : `rounded-lg  text-xl p-2 outline-none ${
                props.readOnly ? "bg-gray-400" : "bg-gray-200"
              } ${
                meta.error
                  ? "border-2 border-red-700"
                  : "focus:border-2 border-black"
              }`
        }`}
        {...field}
        {...props}
      />
      <ErrorMessage
        component="p"
        name={field.name}
        className="text-red-700 break-words whitespace-normal mt-2"
      />
    </div>
  );
};
