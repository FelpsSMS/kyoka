import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React, { useContext, useEffect, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";
import { api } from "../utils/api";
import router from "next/router";
import { setCookie } from "nookies";

export const LoginForm = () => {
  const [newUserForm, setNewUserForm] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  const validateLogin = Yup.object({
    email: Yup.string()
      .required("Por favor, insira seu e-mail de login")
      .email("Por favor, insira um e-mail válido"),
    password: Yup.string().required("Por favor, insira sua senha"),
  });

  const validateRegister = Yup.object({
    email: Yup.string()
      .required("Por favor, insira um e-mail")
      .email("Por favor, insira um e-mail válido"),
    password: Yup.string().required("Por favor, insira uma senha"),
    passwordConfirmation: Yup.string()
      .required("As senhas devem corresponder")
      .oneOf([Yup.ref("password"), null], "As senhas devem corresponder"),
  });

  async function handleLogin({ email, password }) {
    await api
      .post("/users/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.success) {
          //Set jwt token as a cookie

          setCookie(undefined, "kyoka-token", response.data.token, {
            maxAge: 60 * 60 * 24, //1 day
            path: "/",
          });

          router.push("/home");
        } else {
          setLoginSuccessful(!response.data.success);
        }
      });
  }

  async function handleRegistration({ email, password }) {
    await api.post("/users/", {
      email,
      password,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Formik
        initialValues={{
          email: "",
          password: "",
          passwordConfirmation: "",
        }}
        validationSchema={validateLogin}
        onSubmit={(values) => handleLogin(values)}
      >
        {(formik) => (
          <Form
            className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
            sm:shadow-lg lg:w-2/5 md:w-3/5 sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
            whitespace-nowrap"
          >
            {loginSuccessful && (
              <div className="bg-red-200 p-4 rounded-lg w-full">
                <label className="text-red-900">Credenciais inválidas</label>
              </div>
            )}
            <h1 className="font-black text-3xl sm:text-5xl">Login</h1>
            <div className="flex flex-col w-full space-y-4">
              <TextField label="E-mail" name="email" type="text" />
              <TextField label="Senha" name="password" type="password" />
            </div>
            <button className="confirmation-button" type="submit">
              Login
            </button>
            <div className="flex space-x-4">
              <label
                className="text-blue-300 hover:cursor-pointer hover:text-blue-500"
                onClick={() => setNewUserForm(!newUserForm)}
              >
                Criar conta
              </label>

              <label
                className="text-blue-300 hover:cursor-pointer hover:text-blue-500"
                onClick={() => console.log("teste")}
              >
                Esqueceu sua senha?
              </label>
            </div>
          </Form>
        )}
      </Formik>

      {newUserForm && (
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validateRegister}
          onSubmit={(values) => handleRegistration(values)}
        >
          {(formik) => (
            <Form
              className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
            sm:shadow-lg lg:w-2/5 md:w-3/5 sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
            whitespace-nowrap"
            >
              <h1 className="font-black text-3xl sm:text-5xl">Criar conta</h1>
              <div className="flex flex-col w-full space-y-4">
                <TextField label="E-mail" name="email" type="text" />
                <TextField label="Senha" name="password" type="password" />
                <TextField
                  label="Confirmar senha"
                  name="passwordConfirmation"
                  type="password"
                />
              </div>
              <button className="confirmation-button" type="submit">
                Enviar
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
