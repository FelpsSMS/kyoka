const Container = ({ children }) => {
  return (
    <div
      id="container"
      className="flex flex-col justify-center items-center sm:my-8"
    >
      {children}
    </div>
  );
};

export default Container;
