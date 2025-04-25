import React, {useEffect,useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const StepByStepUserData = () => {

    const [stepData, setStepData] = useState([]);

    async function getStepByData() {

        try {
            const response = await axios.get(`${import.meta.env?.VITE_BACKEND_URL}/api/v1/student/get-step-by-data`);

            if (response?.data?.success) {
                setStepData(response.data.data);
            }
        }
        catch (error) {
            console.log("Error to get the step by data", error);
        }
    }

    useEffect(() => {
        getStepByData();
    }, [])

    return (
        <div className="overflow-x-auto p-1">
             <Link to="/step-form" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md">
                            Add More
                            </Link>
        <table className="mt-[20px] min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-indigo-100 text-indigo-900 text-left text-sm font-semibold">
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">DOB</th>
              <th className="p-3 border-b">Country</th>
              <th className="p-3 border-b">State</th>
              <th className="p-3 border-b">Interest</th>
            </tr>
          </thead>
          <tbody>
            {stepData.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 text-sm text-gray-800">
                <td className="p-3 border-b">
                  <img
                    src={`${import.meta.env?.VITE_BACKEND_URL}/${user.img}`} // Change this path to your actual image location
                    alt={user.name}
                    className="w-[58px] h-[42px] object-cover rounded-full border"
                  />
                </td>
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{new Date(user.dob).toLocaleDateString()}</td>
                <td className="p-3 border-b capitalize">{user.country}</td>
                <td className="p-3 border-b">{user.state}</td>
                <td className="p-3 border-b">{user.interest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default StepByStepUserData;
