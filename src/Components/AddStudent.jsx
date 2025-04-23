import React from 'react';

import { Field, Formik, Form } from "formik";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const AddStudent = () => {


    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    async function addStudentData(values) {

        console.log("value of register", values);
        try {

            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/add-student`, values);

            if (response.data.success) {
                toast(`${response.data.message}`);
                navigate("/student-details");
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
                    <h2 class="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Add Student</h2>
                    {errorMessage && <span className=" mt-[10px]  text-red-600 inline-block">{errorMessage} </span>}

                </div>
                <ToastContainer />
                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={{ name: "", email: "", stream: "", number: "", rollNo: "", dob: "", address: "" }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={value => {
                            const errors = {}
                            if (!value.name) errors.name = "Please Enter Your Name";
                            if (!value.email) errors.email = "Enter Your Email";

                            if (!value.stream) errors.stream = "Add Your Stream";

                            if (!value.number) errors.number = "Please Enter your phone No.";
                            if (!value.rollNo) errors.rollNo = "Please Enter your Roll No.";
                            if (!value.dob) errors.dob = "Please Add Your Date of Birth";
                            if (!value.address) errors.address = "Please Add Your Address";



                            return errors;
                        }}

                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            setTimeout(() => {
                                addStudentData(values);
                                setSubmitting(false);
                                resetForm();
                            }, 400);
                        }}

                    >
                        {({ handleSubmit, handleChange, values, errors, setFieldValue }) => (
                            <form class="space-y-6" onSubmit={handleSubmit} >


                                {/* Name */}
                                <div>
                                    <label for="name" class="text-start block text-sm/6 font-medium text-gray-900">Full Name*</label>
                                    <div class="mt-2 text-start">
                                        <input type="text" value={values?.name} onChange={handleChange} name="name" id="name" autocomplete="name" class={`  ${errors?.name ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.name && <span className="text-red-600 inline-block">{errors.name} </span>}
                                    </div>

                                </div>
                                {/* Email */}
                                <div>
                                    <label for="email" class="text-start block text-sm/6 font-medium text-gray-900">Email*</label>
                                    <div class="mt-2 text-start">
                                        <input type="email" value={values?.email} onChange={handleChange} name="email" id="email" autocomplete="email" class={`  ${errors?.email ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.email && <span className="text-red-600 inline-block">{errors.email} </span>}
                                    </div>

                                </div>


                                {/* Stream */}

                                <div>
                                    <label for="stream" class="text-start block text-sm/6 font-medium text-gray-900">Enter Your Stream*</label>
                                    <div class="mt-2 text-start">
                                        <select value={values?.stream} name="stream" id="stream" onChange={handleChange} autocomplete="stream" class={`  ${errors?.stream ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `}>
                                            <option value="" disabled={true}>Select Your Stream</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Civil">Civil</option>
                                        </select>
                                        {errors?.stream && <span className="text-red-600 inline-block">{errors.stream}</span>}
                                    </div>

                                </div>

                                {/* Phone No. */}
                                <div>
                                    <label for="number" class="text-start block text-sm/6 font-medium text-gray-900">Phone Number*</label>
                                    <div class="mt-2 text-start">
                                        <input type="number" value={values?.number} onChange={handleChange} name="number" id="number" autocomplete="number" class={`  ${errors?.number ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.number && <span className="text-red-600 inline-block">{errors.number} </span>}
                                    </div>

                                </div>
                                {/* Roll No. */}
                                <div>
                                    <label for="rollNo" class="text-start block text-sm/6 font-medium text-gray-900">Enter Your Roll No.</label>
                                    <div class="mt-2 text-start">
                                        <input type="text" value={values?.rollNo} onChange={handleChange} name="rollNo" id="rollNo" autocomplete="rollNo" class={`  ${errors?.rollNo ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.rollNo && <span className="text-red-600 inline-block">{errors.rollNo} </span>}
                                    </div>

                                </div>
                                {/* Date Of Birth */}
                                <div>
                                    <label for="dob" class="text-start block text-sm/6 font-medium text-gray-900">Date of Birth*</label>
                                    <div class="mt-2 text-start">
                                        <input type="date" value={values?.dob} onChange={handleChange} name="dob" id="dob" class={`  ${errors?.dob ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.dob && <span className="text-red-600 inline-block">{errors.dob} </span>}
                                    </div>

                                </div>

                                {/* Address */}
                                <div>
                                    <label for="address" class="text-start block text-sm/6 font-medium text-gray-900">Address*</label>
                                    <div class="mt-2 text-start">
                                        <input type="text" value={values?.address} onChange={handleChange} name="address" id="address" autocomplete="address" class={`  ${errors?.address ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                        {errors?.address && <span className="text-red-600 inline-block">{errors.address} </span>}
                                    </div>

                                </div>


                                <div>
                                    <button type="submit" class="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                                </div>
                            </form>)}
                    </Formik>
                    <p class="mt-[20px] text-center text-sm/6 text-gray-500">

                        <Link to="/user-details" class="font-semibold text-indigo-600 hover:text-indigo-500">See Students</Link>
                    </p>


                </div>
            </div>


        </div >
    )
}

export default AddStudent;
