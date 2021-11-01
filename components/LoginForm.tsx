import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React, { useContext } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";

export const LoginForm = () => {
  const { signIn } = useContext(AuthContext);

  const validate = Yup.object({
    email: Yup.string()
      .required("Por favor, insira seu e-mail de login.")
      .email("Por favor, insira um e-mail válido"),
    password: Yup.string().required("Por favor, insira sua senha."),
  });

  async function sendToServer(values) {
    await signIn(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validate}
        onSubmit={(values) => sendToServer(values)}
      >
        {(formik) => (
          <Form
            className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
            sm:shadow-lg lg:w-2/5 md:w-3/5 sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
            whitespace-nowrap"
          >
            <h1 className="font-black text-3xl sm:text-5xl">Login</h1>
            <div className="flex flex-col w-full space-y-4">
              <TextField label="E-mail" name="email" type="text" />
              <TextField label="Senha" name="password" type="password" />
            </div>
            <button className="confirmation-button" type="submit">
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
