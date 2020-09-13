import React, { useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const passwordValidator = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (value === "password") {
      return "Password is too common.";
    }
    if (!isNaN(value)) {
      return "Password cannot be fully numeric.";
    }
  };

  const registerUser = (data) => {
    fetch("http://localhost:8000/auth/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }), // body data type must match "Content-Type" header
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error("Error creating your account");
        }

        res.json();
      })
      .then((userInfo) =>
        fetch("http://localhost:8000/auth/jwt/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }), // body data type must match "Content-Type" header
        })
          .then((res) => res.json())
          .then((userInfo) => {
            setUser({
              username: data.username,
              access: userInfo.access,
              refresh: userInfo.refresh,
            });
            history.push("/");
          })
          .catch((error) => alert("Invalid credentials"))
      )
      .catch((error) => {
        alert("An error occurred when creating your account");
      });
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(registerUser)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="username"
                  name="username"
                  type="text"
                  ref={register}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={register({
                    validate: (value) => passwordValidator(value),
                  })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 px-3">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password Confirmation
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password-confirm"
                  name="passwordConfirm"
                  type="password"
                  ref={register({
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
              {errors.passwordConfirm && (
                <p className="text-sm text-red-600 px-3">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>

            {/* <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm leading-5 text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div> */}

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
                >
                  Sign in
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
