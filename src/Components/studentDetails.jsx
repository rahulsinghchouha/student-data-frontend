import axios from "axios";
import React from "react"
import { useEffect, useState, useRef } from "react";
import { Avatar, List } from 'antd';
import { useNavigate, Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';

function StudentDetails() {


    const [studentDetails, setStudentDetails] = useState([]);
    const [filterStudentDetails, setFilterStudentDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const fileInputRef = useRef(null);

    const [filterStudentData, setFilterStudentData] = useState({ stream: "All", sortData: "" })

    let deleteManyUser = [];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(studentDetails?.length / 10);

    //total pages

    const handlePageChange = (page) => {
        const selectedPage = page?.selected;

        setCurrentPage(selectedPage); // Correctly updates state

        const studentPage = studentDetails?.slice(
            selectedPage * itemsPerPage,
            selectedPage * itemsPerPage + itemsPerPage
        );
        setFilterStudentDetails(studentPage);
    };

    useEffect(() => {

        setCurrentPage(0);

        const studentPage = studentDetails?.slice(
            0 * itemsPerPage,
            0 * itemsPerPage + itemsPerPage
        );

        setFilterStudentDetails(studentPage);

    }, [studentDetails]);

    const navigate = useNavigate();


    async function getStudentDetails() {
        setSearchTerm("");
        //setSelectSort("");
        setFilterStudentData({ stream: "All", sortData: "" });
        try {
            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-students`);

            console.log(" student response data", response.data.data);
            if (response.data?.success) {

                setStudentDetails(response.data.data);
            }

        }
        catch (error) {
            console.log("Error to get the user details", error)
        }
    }

    useEffect(() => {
        getStudentDetails();
    }, []);




    async function updateStudentDetails(studentData) {

        navigate(`/update-student-details`, { state: studentData });

    }
    async function deleteStudentDetails(values) {

        console.log("student details value", values);

        try {
            const response = await axios.delete(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/delete-students`, {
                params: { id: values }
            });

            if (response.data?.success) {
                const newData = studentDetails.filter((student) => student._id !== values)
                setStudentDetails(newData);
            }

        }
        catch (error) {
            console.log("Error to get the user details", error)
        }
    }

    async function filterStream(event) {

        const selectStream = event.target.value;

        setFilterStudentData(prev => ({ ...prev, stream: selectStream }));

        try {

            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-filter-stream`, {
                params: { stream: selectStream }
            });

            if (response?.data?.success) {
                setStudentDetails(response.data.data);
                setFilterStudentData(prev => ({ ...prev, sortData: "" }));
            }

        }
        catch (error) {
            console.log("Error to filter the stream", error);
        }

    }

    async function sortData(event) {

        const sortData = event.target.value;

        //setSelectSort(sortData);

        setSearchTerm("");

        setFilterStudentData(prev => ({ ...prev, sortData: sortData }));

        try {

            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-sort-data`, {
                params: { sortFilter: `${filterStudentData.stream},${sortData}` }
            });


            if (response?.data?.success) {
                setStudentDetails(response.data.data);
            }

        }
        catch (error) {
            console.log("Error to sort the data", error);
        }

    }

    async function handleSearch(e) {
        e.preventDefault();

        console.log(searchTerm);

        try {

            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-search-data`, {
                params: { searchFilter: `${filterStudentData.stream},${filterStudentData.sortData},${searchTerm}` }
            });

            if (response?.data?.success) {
                setStudentDetails(response.data.data);
            }

        }
        catch (error) {
            console.log("Error to search the data", error);
        }
    }

    async function getExcelData() {
        try {
            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-excel-data`, studentDetails, {
                responseType: 'blob', // Treat the response as a binary Blob
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'student_data.xlsx'; // You can make this dynamic too!
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.log("Error to add the data to excel", error);
        }
    }
    async function sendExcelData(jsonData) {

        try {
            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/send-excel-data`, jsonData);
          
            if(response.data.success)
            {
                toast("student added succesfully");
                getStudentDetails();
            }
        }
        catch (error) {
            console.log("Error to get the data to excel", error);
        }
    }

    function deleteManyStudent(id) {
        console.log("student id", id);

        if (!deleteManyUser.find(existingId => existingId === id)) {
            deleteManyUser.push(id);
        }
        else {
            const index = deleteManyUser.indexOf(id);

            deleteManyUser.splice(index, 1);
        }

    }

    async function deleteManyStudents() {
        if (deleteManyUser.length === 0) {
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/delete-many-students`, deleteManyUser);

            if (response.data.success) {
                getStudentDetails();
            }
        }
        catch (error) {
            console.log("Error to delete the many students", error)
        }

    }

    function handleFileUpload(event) {

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0]; // Use first sheet
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Now send to backend
            sendExcelData(jsonData);
        };

        reader.readAsArrayBuffer(file);


    }

    return (
        <div>
            <h1 className="mb-[10px] text-[30px] text-2xl text-center " >Student Details</h1>
            <div className="flex flex-wrap gap-4 justify-evenly items-center p-4 bg-gray-100 rounded-md">
                <ToastContainer/>
                <Link to="/home" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md">
                    Home
                </Link>

                <Link
                    to="/add-student"
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                >
                    Add More Student
                </Link>

                <button
                    onClick={() => getExcelData()}
                    className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                    Export data
                </button>

                <button
                    onClick={() => fileInputRef.current.click()}
                    className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                    import data
                </button>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
            </div>

            <div className="w-[90%] mx-auto h-auto flex flex-wrap items-end justify-between gap-4 py-4">
                {/* Stream Dropdown */}
                <div className="flex flex-col">
                    <p className="mb-1 font-medium">Stream</p>
                    <select
                        id="select-stream"
                        onChange={filterStream}
                        className="px-2 py-1 border border-gray-300 rounded-md"
                        value={filterStudentData.stream}
                    >
                        <option value="All">All Stream</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Electrical">Electrical</option>
                    </select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex flex-col">
                    <p className="mb-1 font-medium">Sort Data</p>
                    <select
                        id="sort-data"
                        onChange={sortData}
                        className="px-2 py-1 border border-gray-300 rounded-md"
                        value={filterStudentData.sortData}
                    >
                        <option value="" disabled>Select sort option</option>
                        <option value="rollNo">According Roll No.</option>
                        <option value="name">According Name</option>
                    </select>
                </div>

                {/* Search Form */}
                <form onSubmit={(e) => handleSearch(e)} className="flex flex-col">
                    <p className="mb-1 font-medium">Search</p>
                    <div className="flex">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name..."
                            className="px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 cursor-pointer py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Reset Button */}
                <div className="flex flex-col">
                    <p className="mb-1 invisible">Reset</p> {/* Keeps alignment consistent */}
                    <button
                        onClick={() => getStudentDetails()}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                    >
                        Reset All
                    </button>
                </div>
                <div className="flex flex-col">
                    <p className="mb-1 invisible">Reset</p> {/* Keeps alignment consistent */}
                    <button
                        onClick={() => deleteManyStudents()}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                    >
                        delete selected
                    </button>
                </div>
            </div>


            <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-indigo-700 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Roll No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Stream</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Phone No.</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">DOB</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Update</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Delete</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">select</th>
                    </tr>
                </thead>
                <tbody>
                    {filterStudentDetails?.map((item, index) => (
                        <tr
                            key={item._id}
                            className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                            <td className="px-6 py-3 text-sm">{item.rollNo}</td>
                            <td className="px-6 py-3 text-sm">{item.name}</td>
                            <td className="px-6 py-3 text-sm">{item.email}</td>
                            <td className="px-6 py-3 text-sm">{item.stream}</td>
                            <td className="px-6 py-3 text-sm">{item.number}</td>
                            <td className="px-6 py-3 text-sm">
                                {new Date(item.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="px-6 py-3 text-sm">{item.address}</td>
                            <td className="px-6 py-3">
                                <button
                                    onClick={() => updateStudentDetails(item)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded shadow-sm"
                                >
                                    Update
                                </button>
                            </td>
                            <td className="px-6 py-3">
                                <button
                                    onClick={() => deleteStudentDetails(item._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow-sm"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="px-6 py-3">
                                <input
                                    type="checkbox"
                                    className="accent-red-600 w-4 h-4"
                                    onChange={() => deleteManyStudent(item._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-[20px] ">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={currentPage + 1 === totalPages ? "" : <FaArrowRightLong />}
                    onPageChange={handlePageChange}
                    pageCount={totalPages}
                    previousLabel={currentPage === 0 ? "" : <FaArrowLeftLong />}
                    renderOnZeroPageCount={null}
                    forcePage={currentPage} // Force ReactPaginate to rese
                    containerClassName="pagination" // Main container
                    pageClassName="page-item" // Each page item (li)
                    pageLinkClassName="page-link" // Each page link (a)
                    activeClassName="active" // Active page item
                    previousClassName="page-item prev border-[0px]  border-white shadow-none " // Previous button
                    nextClassName="page-item next" // Next button
                    breakClassName="page-item break" // Break "..." item
                    disabledClassName="disabled" // Disabled state  
                />
            </div>


        </div >
    )
}

export default StudentDetails;