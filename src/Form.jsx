import React from "react";
import classes from "./Form.module.css";

const Form = ({ location, setLocation, getWeatherCity }) => {
  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (location) {
      getWeatherCity(location.toString().trim());
      setLocation(() => "");
      return;
    }
  };

  return (
    <form
      action="submit"
      className={classes.formEl}
      onSubmit={formSubmitHandler}
    >
      <input
        type="text"
        className={classes.inputEl}
        placeholder="E.g. mumbai"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default Form;
