import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { UserContext } from "../../App";

const Login = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  const { register, handleSubmit } = useForm();
  const login = async (data) => {
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
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Invalid Credentials");
        }

        return res.json();
      })
      .then((userInfo) => {
        setUser({
          username: data.username,
          access: userInfo.refresh,
          refresh: userInfo.access,
        });
        history.push("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div class="bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl leading-9 font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-600 max-w">
          Or{" "}
          <Link
            to="/register"
            class="font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            sign up now
          </Link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(login)}>
            <div>
              <label
                for="username"
                class="block text-sm font-medium leading-5 text-gray-700"
              >
                Username
              </label>
              <div class="mt-1 rounded-md shadow-sm">
                <input
                  id="usrname"
                  name="username"
                  type="text"
                  ref={register}
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div class="mt-6">
              <label
                for="password"
                class="block text-sm font-medium leading-5 text-gray-700"
              >
                Password
              </label>
              <div class="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={register}
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-red focus:border-red-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div class="mt-6">
              <span class="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out"
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

export default Login;
