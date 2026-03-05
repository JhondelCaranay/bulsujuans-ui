"use client";

import React from "react";

import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="flex h-full w-full justify-center items-center bg-[url('/assets/login-bg.png')] bg-cover bg-bottom">
      <div className="w-full h-full absolute bg-[#000000a2]" />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
