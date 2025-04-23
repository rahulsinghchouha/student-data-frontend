import React from 'react';

import { Field, Formik, Form } from "formik";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from 'react-toastify';


function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [otpSend, setOTPSend] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');

    const navigate = useNavigate();

    async function sendOTP(values) {

        setEmail(values.email);

        try {

            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/user/send-otp-forgot-password`, values);

            if (response.data.success) {
                toast("OTP Send Succesfully");
                setOTPSend(true);
            }
        }
        catch (error) {
            console.log("error to Login the user", error);
        }

    }

    async function forgotPassword(values) {

        values.email = email;
        console.log("value of register", values);
        try {

            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/user/forgot-password`, values);

            if (response.data.success) {
                toast(`${response.data.message}`);
                navigate("/");
            }
        }
        catch (error) {
            setErrorMessage(error?.response?.data?.message);
            console.log("error to register the user", error);
        }
    }


    return (

        <div>

            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 class="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Forgot Password</h2>
                    {errorMessage && <span className=" mt-[10px]  text-red-600 inline-block">{errorMessage} </span>}
                         
                </div>
                <ToastContainer />
                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={{ email: "" }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={value => {
                            const errors = {}
                            if (!value.email) errors.email = "Please Enter Your Email";
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                sendOTP(values);
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <form class="space-y-6" onSubmit={handleSubmit} >

                                <div>
                                    <label for="email" class="text-start block text-sm/6 font-medium text-gray-900">Email*</label>
                                    <div class="mt-2 text-start">
                                        <div className='flex gap-[10px]'>
                                            <input type="email" value={values?.email} onChange={handleChange} name="email" id="email" autocomplete="email"  class={`  ${errors?.email ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                            <button type='submit' className='bg-green-700 text-white w-[50px] rounded-[5px] cursor-pointer'>{` ${otpSend ? "resend OTP" : "OTP" }`}</button>
                                        </div>

                                        {errors?.email && <span className="text-red-600 inline-block">{errors.email} </span>}
                                    </div>

                                </div>
                            </form>
                        )}
                    </Formik>

                    <Formik
                        initialValues={{ otp: "", password: "", confirmPassword: "" }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={value => {
                            const errors = {}

                            if (!value.otp) errors.otp = "Enter OTP";

                            if (!value.password) errors.password = "Please Enter Your Password";
                            if (!value.confirmPassword) errors.confirmPassword = "Please Enter Confirm password";
                            if (value.password !== value.confirmPassword) errors.confirmPassword = "Please Enter Correct password";

                            return errors;
                        }}

                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                forgotPassword(values);
                                setSubmitting(false);
                            }, 400);
                        }}

                    >
                        {({ handleSubmit, handleChange, values, errors, setFieldValue }) => (
                            <form class="space-y-6" onSubmit={handleSubmit} >

                                {/* For OTP */}
                                <div className='!mt-[20px]'>
                                    <label for="otp" class="text-start block text-sm/6 font-medium text-gray-900">Enter OTP*</label>
                                    <div class="mt-2 text-start">
                                        <OtpInput
                                            value={values?.otp}
                                            onChange={(otp) => {
                                                // manually set the value using Formik's setFieldValue
                                                setFieldValue("otp", otp);
                                            }}
                                            numInputs={4}
                                            name="otp"
                                            id="otp"
                                            renderSeparator={<span className="mx-2 text-gray-500">-</span>}
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    className="otp-input inline-block !mt-[10px] !w-[35px] !h-[35px] text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                />
                                            )}
                                        />
                                        {errors?.otp && <span className="text-red-600 inline-block">{errors.otp} </span>}
                                    </div>

                                </div>


                                {/* Password */}

                                <div>
                                    <label for="password" class="text-start block text-sm/6 font-medium text-gray-900">Password*</label>
                                    <div class="mt-2 text-start">
                                        <input type="password" value={values?.password} name="password" id="password" onChange={handleChange} autocomplete="current-password"  class={`  ${errors?.password ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.password && <span className="text-red-600 inline-block">{errors.password}</span>}
                                    </div>

                                </div>

                                {/* Confirm Password */}

                                <div>
                                    <label for="confirmPassword" class="text-start block text-sm/6 font-medium text-gray-900">Confirm Password*</label>
                                    <div class="mt-2 text-start">
                                        <input type="password" value={values?.confirmPassword} name="confirmPassword" id="confirmPassword" onChange={handleChange} autocomplete="current-password"  class={`  ${errors?.confirmPassword ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.confirmPassword && <span className="text-red-600 inline-block">{errors.confirmPassword}</span>}
                                    </div>

                                </div>


                                <div>
                                    <button type="submit" class="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Forgot - password</button>
                                </div>
                            </form>)}
                    </Formik>

                    <p class="mt-10 text-center text-sm/6 text-gray-500">

                        <Link to="/" class="font-semibold text-indigo-600 hover:text-indigo-500">back to login</Link>
                    </p>
                </div>
            </div>


        </div >

    )

}

export default ForgotPassword;

