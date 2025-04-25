import React, { useState, useRef } from 'react'
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'



const StepForm = () => {

    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(false);

    const [image, setImage] = useState(null);
    const imageRef = useRef(null);

    const [file, setFile] = useState(null);

    const navigate = useNavigate();


    const [crop, setCrop] = useState({
        unit: 'px', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });


    const [errors, setErrors] = useState({ name: "", img: "", dob: "", countryerror: null, state: "", interest: "" })

    function validateName(name) {
        if (!name) {
            setErrors(prev => ({ ...prev, name: "Please Enter your name" }));

        }
        else {
            setStep1(false);
            setStep2(true);
        }
    }
    function validateStep2(dob) {
        if (!file) {
            setErrors(prev => ({ ...prev, img: "Please Add your image" }))
        }
        if (!dob) {
            setErrors(prev => ({ ...prev, dob: "Please Add your Date Of Birth" }))
        }
        if (img && dob) {
            setStep1(false);
            setStep2(false);
            setStep3(true);

        }
    }







    async function handleRegister(values) {

        console.log("country ", values);

        if (!values.country) {
            setErrors(prev => ({ ...prev, countryerror: "Select your country" }));
            return;
        }
        if (!values.state) {
            setErrors(prev => ({ ...prev, state: "Select your State" }));
            return;
        }
        if (!values.interest.length === 0) {
            setErrors(prev => ({ ...prev, interest: "Please Select your Interest" }))
            return;
        }


        console.log("Values to register the user", values);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("img", file);
        formData.append("dob", values.dob);
        formData.append("country", values.country.name);
        formData.append("state", values.state.name);
        formData.append("interest", values.interest);

        try {

            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/step-by-step-form`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data?.success) {
                navigate("/step-by-data");
            }


        }
        catch (error) {
            console.log("Error to register the user", error);
        }



    }

    //for crop the image




    const [openModal, setOpenModal] = useState(false); // Modal open state
    const [completedCrop, setCompletedCrop] = useState(null);
    const previewCanvasRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result); // Set image to be cropped
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // const handleCropComplete = () => {

    //    if (!completedCrop || !previewCanvasRef.current) return;

    //     console.log("completed crop",completedCrop)

    //     console.log("preview ref",previewCanvasRef.current)

    //     setOpenModal(false);

    //     const canvas = previewCanvasRef.current;
    //     const images = new Image();
    //     images.src = image;

    //     const ctx = canvas.getContext('2d');
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.drawImage(images, completedCrop.x, completedCrop.y, completedCrop.width, completedCrop.height, 0, 0, completedCrop.width, completedCrop.height);

    //     // Generate the preview image after cropping
    //     canvas.toBlob((blob) => {
    //         if (!blob) return;
    //         const preview = URL.createObjectURL(blob);
    //         setPreviewUrl(preview);

    //         // 2. Store cropped blob as a File (optional)
    //         const croppedFile = new File([blob], 'cropped-image.jpg', { type: blob.type });

    //         // 3. Use it as if it were uploaded

    //         setFile(croppedFile);

    //         const url = URL.createObjectURL(croppedFile);
    //          //setImage(url); // to use in image tag
    //         console.log("url-------,url",url);

    //         console.log("cropped file",croppedFile);

    //     });


    // };

    // const handleCropComplete = () => {
    //     if (!completedCrop || !previewCanvasRef.current) return;

    //     setOpenModal(false);

    //     const canvas = previewCanvasRef.current;
    //     const ctx = canvas.getContext('2d');
    //     const images = new Image();

    //     images.src = image; // your original image src

    //     // ✅ Wait for image to fully load before drawing
    //     images.onload = () => {
    //       canvas.width = completedCrop.width;
    //       canvas.height = completedCrop.height;

    //       ctx.clearRect(0, 0, completedCrop.width, completedCrop.height);

    //       // ✅ Draw the cropped section
    //       ctx.drawImage(
    //         images,
    //         completedCrop.x,
    //         completedCrop.y,
    //         completedCrop.width,
    //         completedCrop.height,
    //         0,
    //         0,
    //         completedCrop.width,
    //         completedCrop.height
    //       );

    //       // ✅ Then convert the canvas to a blob and preview/save it
    //       canvas.toBlob((blob) => {
    //         if (!blob) return;
    //         const preview = URL.createObjectURL(blob);
    //         setPreviewUrl(preview);

    //         const croppedFile = new File([blob], 'cropped-image.jpg', { type: blob.type });
    //         setFile(croppedFile);

    //         console.log("Cropped URL:", preview);
    //         console.log("Cropped File:", croppedFile);
    //       });
    //     };
    //   };
    const handleCropComplete = () => {
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) return;

        setOpenModal(false);

        const canvas = previewCanvasRef.current;
        const imageEl = imageRef.current;
        const ctx = canvas.getContext('2d');

        const scaleX = imageEl.naturalWidth / imageEl.width;
        const scaleY = imageEl.naturalHeight / imageEl.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            imageEl,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        canvas.toBlob((blob) => {
            if (!blob) return;

            const preview = URL.createObjectURL(blob);
            setPreviewUrl(preview);

            const croppedFile = new File([blob], 'cropped-image.jpg', { type: blob.type });
            setFile(croppedFile);

          
        });
    };


    return (
        <div>
            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Formik
                    initialValues={{ name: "", country: "", dob: "", state: "", interest: [] }}

                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            handleRegister(values);
                            setSubmitting(false);
                        }, 400);
                    }}

                >
                    {({ handleSubmit, handleChange, values, setFieldValue }) => (
                        <form class="space-y-6" onSubmit={handleSubmit} encType='multipart/form-data' >

                            {/* Step - 1  */}
                            {
                                step1 &&
                                <div>
                                    <div>
                                        <label for="name" class="text-start block text-sm/6 font-medium text-gray-900">Full Name*</label>
                                        <div class="mt-2 text-start">
                                            <input type="text" value={values?.name} onChange={handleChange} name="name" id="name" autocomplete="name" class={`  ${errors?.name ? "border-b-[1px] border-solid border-red-500" : ""} block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                            {errors?.name && <span className="text-red-600 inline-block">{errors.name} </span>}
                                        </div>

                                    </div>
                                    <div className='mt-[20px] flex justify-end '>
                                        <button onClick={() => {
                                            // Manually trigger validation for "name" only
                                            validateName(values?.name);
                                        }}
                                            type='button' class="w-[100px]  cursor-pointer flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
                                    </div>
                                </div>
                            }

                            {/* Step -2  */}
                            {
                                step2 &&
                                <div>
                                    <div>
                                        <label for="img" class="text-start block text-sm/6 font-medium text-gray-900">Image*</label>
                                        <div class="mt-2 text-start">
                                            <div className='flex gap-[5px] '>

                                                <input
                                                    type="file"
                                                    name="img"
                                                    id="img"

                                                    onChange={(e) => {
                                                        setFile(e.currentTarget.files[0]);
                                                        setImage(URL.createObjectURL(e.target.files[0]))

                                                    }} class={`  ${errors?.img ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                            </div>

                                            {image && (
                                                <div>
                                                    <button type="button"

                                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                                        onClick={() => setOpenModal(true)} // Open modal on button click
                                                    >
                                                        Open Crop Modal
                                                    </button>
                                                </div>
                                            )}

                                            {/* Modal Popup for Image Crop */}
                                            {openModal && (
                                                <div
                                                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                                                    onClick={() => setOpenModal(false)} // Close the modal on background click
                                                >
                                                    <div
                                                        className="bg-white p-6 rounded-lg shadow-lg relative"
                                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                                                    >
                                                        <h2 className="text-xl mb-4 font-semibold">Crop Image</h2>

                                                        {/* <ReactCrop
                                                            src={image}
                                                            crop={crop}
                                                            onChange={(newCrop) => setCrop(newCrop)}
                                                            onComplete={(newCrop) => setCompletedCrop(newCrop)} // Set completed crop state
                                                        /> 
                                                         */}
                                                        <ReactCrop crop={crop} onChange={(crop, percentCrop) => setCrop(crop)} onComplete={(c) => setCompletedCrop(c)} >
                                                            <img src={image} ref={imageRef} />
                                                        </ReactCrop>

                                                        <div className="mt-4">
                                                            <button type='button'
                                                                onClick={handleCropComplete} // Trigger cropping when complete
                                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                            >
                                                                Crop & Save
                                                            </button>
                                                        </div>

                                                        {/* Close Modal Button */}
                                                        <button type="button"
                                                            className="absolute top-2 right-2 text-xl"
                                                            onClick={() => setOpenModal(false)} // Close the modal
                                                        >
                                                            ✖
                                                        </button>

                                                        {/* Cropped Image Preview */}
                                                        {/* {previewUrl && (
                                                            <div className="mt-4">
                                                                <p className="font-semibold">Preview of Cropped Image:</p>
                                                                <img src={previewUrl} alt="Cropped Preview" className=" object-cover" />
                                                            </div>
                                                        )} */}

                                                        {/* Canvas for cropping (not visible) */}
                                                        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
                                                    </div>
                                                </div>
                                            )}
                                            {values.img && (
                                                <span className="block mt-1 text-sm text-gray-600">{values.img.name}</span>
                                            )}
                                            {errors?.img && <span className="text-red-600 inline-block">{errors.img}</span>}
                                        </div>
                                    </div>


                                    <div>
                                        <label for="dob" class="text-start block text-sm/6 font-medium text-gray-900">Date Of Birth*</label>
                                        <div class="mt-2 text-start">
                                            <input type="date" value={values?.dob} name="dob" id="dob" onChange={handleChange} autocomplete="current-password" class={`  ${errors?.dob ? "border-b-[1px] border-solid border-red-500" : ""}  block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 `} />
                                            {errors?.dob && <span className="text-red-600 inline-block">{errors.dob}</span>}
                                        </div>

                                    </div>
                                    <div className='mt-[20px] flex justify-between '>
                                        <button onClick={() => {
                                            setStep1(true);
                                            setStep2(false);
                                            setErrors(prev => ({ ...prev, name: "" }))
                                        }}
                                            type='button' class="w-[100px]  cursor-pointer flex  justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Back</button>

                                        <button onClick={() => {
                                            validateStep2(values?.dob);
                                        }}
                                            type='button' class="w-[100px]  cursor-pointer flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
                                    </div>
                                </div>
                            }
                            {/* Step - 3 */}
                            {
                                step3 &&
                                <div>
                                    <div>
                                        <label for="country" class="text-start block text-sm/6 font-medium text-gray-900">Select Country*</label>
                                        <div class="mt-2 text-start">
                                            <CountrySelect
                                                containerClassName="form-group"
                                                inputClassName=""
                                                onChange={(selectedCountry) => {
                                                    setFieldValue('country', selectedCountry);
                                                    setFieldValue('state', ''); // clear state properly
                                                }}
                                                name='country'
                                                defaultValue={values?.country}
                                                onTextChange={(_txt) => console.log(_txt)}
                                                placeHolder="Select Country"
                                            />
                                            {errors?.countryerror && <span id='countryerror' className="text-red-600 inline-block">{errors?.countryerror} </span>}
                                        </div>

                                    </div>

                                    <div>
                                        <label for="state" class="text-start block text-sm/6 font-medium text-gray-900">Select State</label>
                                        <div class="mt-2 text-start">
                                            <StateSelect
                                                countryid={values?.country?.id}
                                                containerClassName="form-group"
                                                inputClassName=""
                                                name='state'
                                                onChange={(selectedState) => {
                                                    setFieldValue('state', selectedState);
                                                }}
                                                onTextChange={(_txt) => console.log(_txt)}
                                                defaultValue={values?.state}
                                                placeHolder="Select State"
                                            />
                                            {errors?.state && <span className="text-red-600 inline-block">{errors.state} </span>}
                                        </div>

                                    </div>

                                    <div>
                                        <label for="interest" class="text-start block text-sm/6 font-medium text-gray-900">Select Your Interest*</label>
                                        <div class="mt-2  text-start">
                                            <div className='flex gap-2'>
                                                <input type="checkbox"
                                                    value="hockey"
                                                    checked={values.interest.includes("hockey")}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.value;
                                                        const updated = checked
                                                            ? [...values.interest, value]
                                                            : values.interest.filter((item) => item !== value);

                                                        setFieldValue("interest", updated);
                                                    }} />
                                                <label>Hockey</label>

                                            </div>

                                            <div className='flex gap-2'>
                                                <input type='checkbox' value="cricket"
                                                    checked={values.interest.includes("cricket")}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.value;
                                                        const updated = checked
                                                            ? [...values.interest, value]
                                                            : values.interest.filter((item) => item !== value);

                                                        setFieldValue("interest", updated);
                                                    }} />
                                                <label>Cricket</label>

                                            </div>

                                            <div className='flex gap-2'>
                                                <input type='checkbox' value="music"
                                                    checked={values.interest.includes("music")}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.value;
                                                        const updated = checked
                                                            ? [...values.interest, value]
                                                            : values.interest.filter((item) => item !== value);

                                                        setFieldValue("interest", updated);
                                                    }}




                                                />
                                                <label>Music</label>

                                            </div>

                                            <div className='flex gap-2'>
                                                <input type='checkbox' value="football"
                                                    checked={values.interest.includes("football")}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.value;
                                                        const updated = checked
                                                            ? [...values.interest, value]
                                                            : values.interest.filter((item) => item !== value);

                                                        setFieldValue("interest", updated);
                                                    }}
                                                />
                                                <label>Football</label>

                                            </div>






                                            {errors?.interest && <span className="text-red-600 inline-block">{errors.interest} </span>}
                                        </div>

                                    </div>
                                    <div className='mt-[20px] flex justify-between '>
                                        <button onClick={() => {
                                            setStep1(false);
                                            setStep2(true);
                                            setStep3(false);
                                            setErrors(prev => ({ ...prev, img: "", dob: "" }))
                                        }}
                                            type='button'
                                            class="w-[100px]  cursor-pointer flex  justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Back</button>

                                        <button type="submit" class=" w-[100px]  cursor-pointer flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
                                    </div>


                                </div>
                            }





                        </form>)}
                </Formik>

            </div>
        </div >
    )
}

export default StepForm;
