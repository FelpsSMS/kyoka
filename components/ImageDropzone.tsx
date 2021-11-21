import { useField } from "formik";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "next-i18next";

export default function ImageDropzone(props) {
  const [field, meta, helpers] = useField(props);
  const [imageContentURL, setImageContentURL] = useState(props.webSource ?? "");
  const [rejectFile, setRejectFile] = useState(false);
  const [rejectFileSize, setRejectFileSize] = useState(false);

  const { t } = useTranslation();

  const imageLoader = ({ src }) => {
    return src;
  };

  const checkFile = useCallback(
    (file) => {
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
    accept: "image/*",
    maxSize: 5242880, //5MB
    onDrop,
  });

  return (
    <div className="relative flex flex-col whitespace-nowrap">
      <div
        className={`${
          props.readOnly ? "bg-gray-400" : "bg-gray-200"
        } w-16 h-16 scale-105 rounded-lg hover:cursor-pointer hover:scale-110 relative`}
        {...getRootProps()}
      >
        {imageContentURL && (
          <Image
            loader={imageLoader}
            src={imageContentURL}
            alt="Uploaded image"
            layout="fill"
            objectFit="contain"
            unoptimized={true}
          />
        )}
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
        <p className="absolute mt-16 text-red-700">
          {t("file_needs_to_be_image")}
        </p>
      )}
      {rejectFileSize && (
        <p className="absolute mt-16 text-red-700">
          {t("file_needs_to_be_smaller")}
        </p>
      )}
    </div>
  );
}
