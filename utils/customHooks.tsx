import { useMemo } from "react";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";

export function useValidator(needValidation) {
  const { t } = useTranslation();

  return useMemo(() => {
    const validationObject: { [key: string]: Yup.StringSchema } = {};

    needValidation.forEach((item) => {
      validationObject[item.fieldName] = Yup.string().required(
        t("field_required")
      );
    });

    return Yup.object(validationObject);
  }, [needValidation, t]);
}
