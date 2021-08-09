export const ConfirmationButton = ({ text, type }) => {
  return (
    <button
      className="bg-gray-900 text-white p-2 px-16 rounded-sm text-xl font-bold focus:text-gray-200 
        focus:bg-black hover:text-gray-200 hover:bg-black outline-none"
      type={type}
    >
      {text}
    </button>
  );
};
