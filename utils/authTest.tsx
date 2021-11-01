import { api } from "./api";

interface SignInRequestInterface {
  email: string;
  password: string;
}

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestInterface) {
  await delay();

  //api.post("etcetc")

  return {
    token: "TESTE",
    user: {
      name: "nameTeste",
      email: "emailTeste",
    },
  };
}

export async function recoverUser() {
  await delay();

  return {
    token: "TESTE",
    user: {
      name: "nameTeste",
      email: "emailTeste",
    },
  };
}
