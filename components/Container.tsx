const Container = ({ children }) => {
  return (
    <div
      id="container"
      className="flex flex-col justify-center items-center min-h-screen min-w-screen"
    >
      {children}
    </div>
  );
};

export default Container;
