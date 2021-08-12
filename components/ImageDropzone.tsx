import { useField } from "formik";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone(props) {
  const [field, meta, helpers] = useField(props);
  const [imageContentURL, setImageContentURL] = useState("");
  const [rejectFile, setRejectFile] = useState(false);
  const [rejectFileSize, setRejectFileSize] = useState(false);

  const imageLoader = ({ src }) => {
    return src;
  };

  function checkFile(file) {
    const reader = new FileReader();

    if (!file.type.match("image.*")) {
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
      // Do whatever you want with the file contents

      const binaryStr = reader.result;

      const blob = new Blob([binaryStr]);
      const url = URL.createObjectURL(blob);

      setImageContentURL(url);
    };
    reader.readAsArrayBuffer(file);
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      checkFile(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5242880, //5MB
    onDrop,
  });

  return (
    <div className="flex flex-col whitespace-nowrap relative">
      <div
        className="bg-gray-200 h-16 w-16 hover:cursor-pointer rounded-lg scale-105 hover:scale-110"
        {...getRootProps()}
      >
        {imageContentURL && (
          <Image
            loader={imageLoader}
            src={imageContentURL}
            alt="Uploaded image"
            layout="fill"
            objectFit="contain"
          />
        )}
        <input
          {...getInputProps()}
          onChange={(event) => {
            const file = event.target.files[0];
            checkFile(file);
          }}
        />
      </div>
      {rejectFile && (
        <p className="absolute mt-16 text-red-700">
          O arquivo precisa ser uma imagem
        </p>
      )}
      {rejectFileSize && (
        <p className="absolute mt-16 text-red-700">
          O arquivo precisa ser menor do que 5MB
        </p>
      )}
    </div>
  );
}
