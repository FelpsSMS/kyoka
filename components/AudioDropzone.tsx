import { useField } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@heroicons/react/outline";

export default function AudioDropzone(props) {
  const [field, meta, helpers] = useField(props);
  const [audioContentURL, setAudioContentURL] = useState(props.webSource ?? "");
  const [rejectFile, setRejectFile] = useState(false);
  const [rejectFileSize, setRejectFileSize] = useState(false);

  const audioRef = useRef(null);

  function checkFile(file) {
    const reader = new FileReader();

    if (!file.type.match("audio.*")) {
      setRejectFile(true);
      return;
    }

    if (file.size > 5242880) {
      //5MB
      setRejectFileSize(true);
      return;
    }

    props.fileExchange(file);
    setRejectFile(false);
    setRejectFileSize(false);

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
      const blob = new Blob([binaryStr]);
      const url = URL.createObjectURL(blob);

      setAudioContentURL(url);
      audioRef.current.pause();
      audioRef.current.load();
    };
    reader.readAsArrayBuffer(file);
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      checkFile(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    maxSize: 5242880, //5MB
    onDrop,
  });

  return (
    <div className="relative flex flex-col space-y-4 whitespace-nowrap">
      <label className="text-xl font-normal">{props.label}</label>
      <div
        className="w-16 h-16 scale-105 rounded-lg hover:cursor-pointer hover:scale-110"
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
        <audio controls ref={audioRef}>
          <source src={audioContentURL} />
        </audio>
      )}
      {rejectFile && (
        <p className="text-red-700 ">
          O arquivo precisa ser uma faixa de áudio
        </p>
      )}
      {rejectFileSize && (
        <p className="text-red-700 ">O arquivo precisa ser menor do que 5MB</p>
      )}
    </div>
  );
}
