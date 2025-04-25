import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div class="text-center space-y-6">
                <h1 class="text-3xl font-bold text-gray-800">Welcome</h1>
                <div class="flex justify-center gap-6">
                    <Link to="/student-details" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded">
                        Student
                    </Link>
                    <Link to="/user-details" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
                        User
                    </Link>
                    <Link to="/step-form" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
                       Step Form
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
