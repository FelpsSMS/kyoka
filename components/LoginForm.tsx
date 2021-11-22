import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import React, { useState } from "react";
import { api } from "../utils/api";
import router from "next/router";
import { setCookie } from "nookies";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

export const LoginForm = () => {
  const [newUserForm, setNewUserForm] = useState(false);
  const [forgotPasswordForm, setForgotPasswordForm] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [informedEmail, setInformedEmail] = useState("");

  const { t } = useTranslation();

  const validateLogin = Yup.object({
    email: Yup.string()
      .required(t("email_login_validation_required_msg"))
      .email(t("email_login_validation_msg")),
    password: Yup.string().required(
      t("password_login_validation_required_msg")
    ),
  });

  const regex: RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

  const regex2: RegExp = new RegExp("^(?!.*\\s)");

  const passwordMinSize = 6;

  const validateRegister = Yup.object({
    email: Yup.string()
      .required(t("email_register_validation_required_msg"))
      .email(t("email_login_validation_msg")),
    password: Yup.string()
      .required(t("password_register_validation_required_msg"))
      .min(
        passwordMinSize,
        t("password_min_len_msg", {
          passwordMinSize,
        })
      )
      .matches(regex, t("password_requirements_msg"))
      .matches(regex2, t("password_no_spaces_msg")),
    passwordConfirmation: Yup.string()

      .required(t("passwords_must_match_msg"))
      .oneOf([Yup.ref("password"), null], t("passwords_must_match_msg")),
  });

  const validateForgot = Yup.object({
    email: Yup.string()
      .required(t("email_login_validation_required_msg"))
      .email(t("email_login_validation_msg")),
  });

  async function handleLogin({ email, password }) {
    setInformedEmail(email);

    await api
      .post("/users/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.success) {
          //Set jwt token as a cookie

          if (response.data.isVerified) {
            setCookie(undefined, "kyoka-token", response.data.token, {
              maxAge: 60 * 60 * 24, //1 day
              path: "/",
            });

            router.push("/home");
          } else {
            setVerificationSuccessful(true);
          }
        } else {
          setLoginSuccessful(!response.data.success);
        }
      });
  }

  async function handleRegistration({ email, password }) {
    await api
      .post("/users/", {
        email,
        password,
      })
      .then(() => {
        api
          .post("/users/email-verification", {
            email,
          })
          .then(() => {
            setEmailVerificationSent(true);
          });
      });
  }

  async function handleForgot({ email }) {
    await api
      .post("/users/forgot", {
        email,
      })
      .then((response) => {
        setPasswordResetSuccessful(response.data.success);
      });
  }

  async function sendVerificationEmail(email) {
    await api.post(`users/email-verification`, {
      email,
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
              <motion.div
                className="bg-red-200 p-4 rounded-lg w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-red-900">
                  {t("invalid_credentials_msg")}
                </label>
              </motion.div>
            )}

            {verificationSuccessful && (
              <motion.div
                className="bg-red-200 p-4 rounded-lg w-full flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-red-900 whitespace-normal">
                  {t("req_verify_account_msg")}
                </label>
                <a
                  className="text-blue-500 hover:cursor-pointer hover:text-blue-700"
                  onClick={() => sendVerificationEmail(informedEmail)}
                >
                  {t("click_here")}
                </a>
              </motion.div>
            )}
            <h1 className="font-black text-3xl sm:text-5xl">Login</h1>
            <div className="flex flex-col w-full space-y-4">
              <TextField label="E-mail" name="email" type="text" />
              <TextField label="Senha" name="password" type="password" />
            </div>
            <button className="confirmation-button" type="submit">
              {t("login")}
            </button>
            <div className="flex space-x-4">
              <label
                className="text-blue-300 hover:cursor-pointer hover:text-blue-500"
                onClick={() => {
                  setNewUserForm(!newUserForm);
                  setForgotPasswordForm(false);
                }}
              >
                {t("create_account")}
              </label>

              <label
                className="text-blue-300 hover:cursor-pointer hover:text-blue-500"
                onClick={() => {
                  setForgotPasswordForm(!forgotPasswordForm);
                  setNewUserForm(false);
                }}
              >
                {t("forgot_password")}
              </label>
            </div>
          </Form>
        )}
      </Formik>

      {newUserForm && (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
              passwordConfirmation: "",
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
                {emailVerificationSent && (
                  <motion.div
                    className="bg-green-200 p-4 rounded-lg w-full flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-green-900 whitespace-normal">
                      {t("verification_email_sent")}
                    </label>
                    <a
                      className="text-blue-500 hover:cursor-pointer hover:text-blue-700"
                      onClick={() => sendVerificationEmail(informedEmail)}
                    >
                      {t("click_here")}
                    </a>
                  </motion.div>
                )}
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
                  {t("send")}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      )}

      {forgotPasswordForm && (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={validateForgot}
            onSubmit={(values) => handleForgot(values)}
          >
            {(formik) => (
              <Form
                className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
              sm:shadow-lg lg:w-2/5 md:w-3/5 sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
              whitespace-nowrap"
              >
                {passwordResetSuccessful && (
                  <motion.div
                    className="bg-green-200 p-4 rounded-lg w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-green-900">
                      {t("confirmation_sent")}
                    </label>
                  </motion.div>
                )}
                <h1 className="font-black text-3xl sm:text-5xl">
                  {t("insert_email")}
                </h1>
                <div className="flex flex-col w-full space-y-4">
                  <TextField label="E-mail" name="email" type="text" />
                </div>
                <button className="confirmation-button" type="submit">
                  {t("send")}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      )}
    </div>
  );
};
