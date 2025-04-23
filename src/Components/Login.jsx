import React, { useState } from 'react';
import { Field, Formik, Form } from "formik";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ForgotPassword from './ForgotPassword';

const Login = () => {

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage] = useState('');

    async function handleLogin(values) {
      
        try {
             const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/user/login`, values);
          
            if (response.data?.success) {
                toast(`${response.data.message}`);
                navigate('/home');
            }
            
        }
        catch (error) {
            setErrorMessage(error?.response?.data?.message);
            console.log("error to Login the user", error);
        }

    }


    return (
        <div>

            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                    {errorMessage && <span className="   text-red-600 inline-block">{errorMessage}</span>}
                                
                </div>
                <ToastContainer/>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={value => {
                            const errors = {}
                            if (!value.email) errors.email = "Please Enter Your Email";
                            if (!value.password) errors.password = "Please Enter Your Password";

                            return errors;
                        }}

                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                handleLogin(values);
                                setSubmitting(false);
                            }, 400);
                        }}

                    >
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <form class="space-y-6" onSubmit={handleSubmit} >
                                <div>
                                    <label for="email" class="text-start block text-sm/6 font-medium text-gray-900">Email address</label>
                                    <div class="mt-2 text-start">
                                        <input type="email" value={values?.email} onChange={handleChange} name="email" id="email" autocomplete="email"  class={`  ${errors?.email ? "text-start border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                    </div>
                                    {errors?.email && <span className="text-start text-red-600 inline-block">{errors.email} </span>}
                                </div>

                                <div>
                                    <div class="flex items-center justify-between">
                                        <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                                    </div>

                                    <div class="mt-2 text-start">
                                        <input type="password" value={values?.password} name="password" id="password" onChange={handleChange} autocomplete="current-password"  class={`  ${errors?.password ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.password && <span className=" text-red-600 inline-block">{errors.password}</span>}
                                    </div>
                                    <div class="flex items-center justify-between">

                                        <div class="text-sm">
                                            <Link to="forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                                </div>
                            </form>)}
                    </Formik>

                    <p class="mt-10 text-center text-sm/6 text-gray-500">

                        <Link to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Create new account</Link>
                    </p>
                </div>
            </div>


        </div>
    )
}

export default Login;
