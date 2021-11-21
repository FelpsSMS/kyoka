const getLabelLocale = (locale) => {
  let labelNumber = 1;

  switch (locale) {
    case "pt":
      labelNumber = 0;
      break;

    case "en":
      labelNumber = 1;
      break;

    case "ja":
      labelNumber = 2;
      break;
  }

  return labelNumber;
};

export default getLabelLocale;
