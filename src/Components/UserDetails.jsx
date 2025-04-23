import axios from "axios";
import React from "react"
import { useEffect, useState } from "react";
import { Avatar, List } from 'antd';
import { useNavigate, Link } from "react-router-dom";


function UserDetails() {

    const [userDetail, setUserDetails] = useState([]);


    const navigate = useNavigate();

    async function getUserDetails() {
        try {
            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/user/user-details`);

            console.log("response data", response.data.data);
            if (response.data?.success)
                setUserDetails(response.data.data)
        }
        catch (error) {
            console.log("Error to get the user details", error)
        }
    }



    useEffect(() => {
        getUserDetails();

    }, []);


    function updateUserDetails(userData) {

        navigate("/update-user", { state: userData });

    }



    return (
        <div>
            <h1 className="my-[20px] text-[30px] text-2xl text-center " >User Details</h1>

            <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-indigo-600 text-white flex items-center justify-center rounded-full text-2xl font-bold">
                        {userDetail[0]?.name?.split(' ')[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{userDetail[0]?.name}</h2>
                        <p className="text-sm text-gray-500">{userDetail[0]?.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Roll Number:</span>
                        <span>{userDetail[0]?.rollNo}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Date of Birth:</span>
                        <span>
                            {new Date(userDetail[0]?.dob).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Address:</span>
                        <span>{userDetail[0]?.address}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <Link to="/home" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md">
                    Home
                    </Link>
                    <button
                        onClick={() => updateUserDetails(userDetail[0])}
                        className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

        </div >
    )
}

export default UserDetails;