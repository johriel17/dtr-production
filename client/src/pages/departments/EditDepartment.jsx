import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import BackButton from '../../components/BackButton';
import ApiClient from '../../components/Api';
import { useNavigate, useParams } from 'react-router-dom';
const EditDepartment = () => {
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const api = ApiClient()

  const {id} = useParams()

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const res = await api.get(`/departments/${id}`);
        setName(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();

  }, [])

  const handleUpdateDepartment = async () => {
    const data = {
      name,
    };
  
    try {
      await api.put(`/departments/${id}`, data);
      navigate('/departments');
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };
  
  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
      <BackButton destination={'/departments'}/>
      <div className="flex justify-center items-center">
          <h3 className="text-2xl my-8 font-extrabold">Edit DEpartment</h3>
      </div>
              
        <form className="w-full mx-auto py-5">
          <div className="flex gap-x-5">
            <div className="flex-1 mb-5">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Department Name <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} id="name" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}/>
                {errors.name && <div className="text-red-600">{errors.name}</div>}
            </div>
          </div>
          <div className="flex justify-end items-center">
          <button type="button" onClick={handleUpdateDepartment} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 self-end">Update</button>
          </div>
        </form>

    </div>
  )
}

export default EditDepartment