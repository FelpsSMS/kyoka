import { useField } from "formik";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@heroicons/react/outline";
import { useTranslation } from "next-i18next";

export default function JsonDropzone(props) {
  const [field, meta, helpers] = useField(props);

  const [rejectFile, setRejectFile] = useState(false);
  const [rejectFileSize, setRejectFileSize] = useState(false);

  const { t } = useTranslation();

  const checkFile = useCallback(
    (file) => {
      const reader = new FileReader();

      props.fileExchange(file);
      setRejectFile(false);
      setRejectFileSize(false);

      props.setFileName(file.name);

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const data: any = reader.result;

        const dataView = new DataView(data);
        const decoder = new TextDecoder("utf8");

        const json = JSON.parse(decoder.decode(dataView));

        props.setResponse(json);
      };
      reader.readAsArrayBuffer(file);
    },
    [props]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        checkFile(file);
      });
    },
    [checkFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "json/*",
    //maxSize: 5242880, //5MB
    onDrop,
  });

  return (
    <div className="relative flex flex-col space-y-4 whitespace-nowrap justify-center items-center">
      <label className="text-xl font-normal">{props.label}</label>
      <div
        className="w-16 h-16 scale-105 rounded-lg hover:cursor-pointer hover:scale-110"
        {...getRootProps()}
      >
        <UploadIcon className="w-full h-full text-black" />
        {!props.readOnly && (
          <input
            {...getInputProps()}
            onChange={(event) => {
              const file = event.target.files[0];
              checkFile(file);
            }}
          />
        )}
      </div>

      {rejectFile && (
        <p className="text-red-700 ">{t("file_needs_to_be_json")}</p>
      )}
      {/* {rejectFileSize && (
        <p className="text-red-700 ">O arquivo precisa ser menor do que 5MB</p>
      )} */}
    </div>
  );
}
