import { useMemo } from "react";
import * as Yup from "yup";

export function useValidator(needValidation) {
  return useMemo(() => {
    const validationObject: { [key: string]: Yup.StringSchema } = {};

    needValidation.forEach((item) => {
      validationObject[item.fieldName] = Yup.string().required(
        "Este campo é obrigatório"
      );
    });

    return Yup.object(validationObject);
  }, [needValidation]);
}
