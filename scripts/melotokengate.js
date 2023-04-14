const elements = document.querySelectorAll(".melotokengate.js");

// We loop through all the elements that have the class name "your-component" and render our React component inside of it, this allows you to add multiple instances of the same component to different pages.

elements &&
  [...elements].forEach((node) => {
    const root = createRoot(node);
    root.render(<YourComponent />);
  });
