import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register'
import ForgotPassword from './Components/ForgotPassword';
import UserDetails from './Components/UserDetails';
import UpdateUser from './Components/UpdateUser';
import AddStudent from './Components/AddStudent';
import UpdateStudentDetails from './Components/UpdateStudentDetails';
import StudentDetails from './Components/studentDetails';
import Home from './Components/Home';
import StepForm from './Components/stepForm';
import StepByStepUserData from './Components/StepByStepUserData';



import ImageCropFormik from './Components/CropImage';


function App() {


  return (
    <> 
      <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/update-user" element={<UpdateUser />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/update-student-details" element={<UpdateStudentDetails />} />
            <Route path="/student-details" element={<StudentDetails />} />
            <Route path="/step-form" element={<StepForm />} />
            <Route path="/step-by-data" element={<StepByStepUserData />} />
            <Route path="/home" element={<Home />} />


            <Route path="/image-crop" element={<ImageCropFormik />} />


          </Routes>
      </Router>
    
    </>
  )
}

export default App;
