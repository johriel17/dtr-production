import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
// import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import ApiClient from '../../components/Api';
import { useNavigate, useParams } from 'react-router-dom';
const EditDtr = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dtrNum, setDtrNum] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const api = ApiClient()

  const {id} = useParams()

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const res = await api.get(`/dtrs/${id}`);
        setDtrNum(res.data.dtrNum);
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();

  }, [])

  const handleUpdateDtr = async () => {
    const data = {
      dtrNum,
      startDate,
      endDate,
    };
  
    try {
      await api.put(`/dtrs/${id}`, data);
      navigate('/dtrs');
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };
  
  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
      <BackButton destination={'/dtrs'}/>
      <div className="flex justify-center items-center">
          <h3 className="text-2xl my-8 font-extrabold">Edit Daily Time Record</h3>
      </div>
       
       {/* {loading && <Spinner/>} */}
          
        <form className="w-full mx-auto py-5">
          <div className="flex gap-x-5">
            <div className="flex-1 mb-5">
                <label htmlFor="dtrNo" className="block mb-2 text-sm font-medium text-gray-900">Dtr No. <span className="text-red-500">*</span></label>
                <input type="text" value={dtrNum} onChange={(e) => {setDtrNum(e.target.value)}} id="dtrNo" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.dtrNum ? 'border-red-400' : 'border-gray-300'}`}/>
                {errors.dtrNum && <div className="text-red-600">{errors.dtrNum}</div>}
            </div>
            <div className="flex-1 mb-5">
                <label htmlFor="start" className="block mb-2 text-sm font-medium text-gray-900">Start Date <span className="text-red-500">*</span></label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.startDate   ? 'border-red-400' : 'border-gray-300'}`} />
                {errors.startDate && <div className="text-red-600">{errors.startDate}</div>}
            </div>
            <div className="flex-1 mb-5">
                <label htmlFor="end" className="block mb-2 text-sm font-medium text-gray-900">End Date <span className="text-red-500">*</span></label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.endDate   ? 'border-red-400' : 'border-gray-300'}`} />
                {errors.endDate && <div className="text-red-600">{errors.endDate}</div>}
            </div>
          </div>
          <div className="flex justify-end items-center">
          <button type="button" onClick={handleUpdateDtr} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 self-end">Update</button>
          </div>
        </form>

    </div>
  )
}

export default EditDtr