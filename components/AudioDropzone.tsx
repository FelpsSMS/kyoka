import { useField } from "formik";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@heroicons/react/outline";

export default function AudioDropzone(props) {
  const [field, meta, helpers] = useField(props);
  const [audioContentURL, setAudioContentURL] = useState("");
  const [rejectFile, setRejectFile] = useState(false);
  const [rejectFileSize, setRejectFileSize] = useState(false);

  function checkFile(file) {
    const reader = new FileReader();

    if (!file.type.match("audio.*")) {
      setRejectFile(true);
      return;
    }

    if (file.size > 5242880) {
      //5MB
      console.log(file.size);
      setRejectFileSize(true);
      return;
    }

    props.fileExchange(file);
    setRejectFile(false);
    setRejectFileSize(false);

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents

      const binaryStr = reader.result;

      //console.log(binaryStr);
      const blob = new Blob([binaryStr]);
      const url = URL.createObjectURL(blob);

      setAudioContentURL(url);
    };
    reader.readAsArrayBuffer(file);
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      checkFile(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: "audio/*",
      maxSize: 5242880, //5MB
      onDrop,
    });

  return (
    <div className="flex flex-col whitespace-nowrap relative space-y-4">
      <label className="font-normal text-xl">{props.label}</label>
      <div
        className="h-16 w-16 hover:cursor-pointer rounded-lg scale-105 hover:scale-110"
        {...getRootProps()}
      >
        <UploadIcon className="w-full h-full text-black" />
        <input
          {...getInputProps()}
          onChange={(event) => {
            const file = event.target.files[0];
            checkFile(file);
          }}
        />
      </div>
      {audioContentURL && (
        <audio controls>
          <source src={audioContentURL} />
        </audio>
      )}
      {rejectFile && (
        <p className=" text-red-700">
          O arquivo precisa ser uma faixa de áudio
        </p>
      )}
      {rejectFileSize && (
        <p className=" text-red-700">O arquivo precisa ser menor do que 5MB</p>
      )}
    </div>
  );
}
