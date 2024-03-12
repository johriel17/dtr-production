import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import ApiClient from "../../components/Api";
import { useNavigate } from "react-router-dom";
const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("admin");
  // const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState(null);
  const [employee, setEmployee] = useState(null)

  const navigate = useNavigate();
  const api = ApiClient();

  useEffect(() => {

    if(userType === 'employee'){
        const fetchEmployees = async () => {
          try{
            const res = await api.get("/employees")
            setEmployees(res.data)
            setEmployee(res.data[0]._id)
          }catch(error){
            console.log(error)
          }
        }

        fetchEmployees()
    }

  }, [userType]);

  const handleSaveUser = async () => {
    const data = {
      username,
      password,
      email,
      userType,
      employee,
    };

    try{
      await api.post("/users", data)
      navigate("/users");
    }catch(error){
      setErrors(error.response.data.errors);
    }
    
  };

  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
      <BackButton destination={"/users"} />
      <div className="flex justify-center items-center">
        <h3 className="text-2xl my-8 font-extrabold">
          Add New User
        </h3>
      </div>

      {/* {loading && <Spinner />} */}

      <form className="w-full mx-auto py-5">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="email"
              className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-11/12 p-2.5 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && <div className="text-red-600">{errors.email}</div>}
          </div>
          <div className="w-full md:w-1/2 mb-5">
            <label
              htmlFor="uname"
              className="block mb-2 text-sm font-medium text-gray-900">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              id="uname"
              className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-11/12 p-2.5 ${
                errors.username ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <div className="text-red-600">{errors.username}</div>
            )}
          </div>
          <div className="w-full md:w-1/2 mb-5">
            <label
              htmlFor="pword"
              className="block mb-2 text-sm font-medium text-gray-900">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="pword"
              className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-11/12 p-2.5 ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <div className="text-red-600">{errors.password}</div>
            )}
          </div>
          <div className="w-full md:w-1/2 mb-5">
            <label
              htmlFor="utype"
              className="block mb-2 text-sm font-medium text-gray-900">
              User Type
            </label>
            <select
              id="utype"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-11/12 p-2.5 ">
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
            {errors.userType && (
              <div className="text-red-600">{errors.userType}</div>
            )}
          </div>
          {userType === "employee" && (
                <div className="w-full md:w-1/2 mb-5">
                <label
                htmlFor="emp"
                className="block mb-2 text-sm font-medium text-gray-900">
                Employee
                </label>
                <select
                id="emp"
                onChange={(e) => setEmployee(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-11/12 p-2.5 ">
                {employees?.map((employee,index) => (
                    <option key={employee._id} value={employee._id}>{`${employee.employeeNo} - ${employee.lastName}`}</option>
                ))

                }
                </select>
                {errors.userType && (
                <div className="text-red-600">{errors.userType}</div>
                )}
                </div>
          )}
        </div>
        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={handleSaveUser}
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 self-end">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
