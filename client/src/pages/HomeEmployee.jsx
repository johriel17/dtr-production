import React, { useEffect, useState } from 'react'
import Clock from '../components/Clock'
import { useAuthContext } from '../hooks/useAuthContext'
import ApiClient from '../components/Api'

const HomeEmployee = () => {

    const {user} = useAuthContext()
    const api = ApiClient()

    const [timeIn, setTimeIn] = useState(null)
    const [timeOut, setTimeOut] = useState(null)

    useEffect(() => {

        const fetchAttendance = async() => {

            try {
                const res = await api.get(`/dtrs/attendance/${user.employee._id}/${user.employee.department}`);
                const currentDate = new Date();
                const timeIn = res.data.dtrEmployeeSubs.timeIn ? res.data.dtrEmployeeSubs.timeIn : null;
                const timeOut = res.data.dtrEmployeeSubs.timeOut ? res.data.dtrEmployeeSubs.timeOut : null;
                if(timeIn !== null){
                    const dateTimeString = `${currentDate.toISOString().split('T')[0]}T${timeIn}:00.000Z`;
                    const time = new Date(dateTimeString).toLocaleTimeString();
                    setTimeIn(time)
                }
                if(timeOut !== null){
                    const dateTimeString = `${currentDate.toISOString().split('T')[0]}T${timeIn}:00.000Z`;
                    const time = new Date(dateTimeString).toLocaleTimeString();
                    setTimeOut(time)
                }    
            } catch (error) {
                console.log(error);
            }
           


        }

        fetchAttendance()

    },[])

    const handleTimeIn = async () => {
        const time = new Date().toLocaleTimeString()
        setTimeIn(time)

        try{
            const res = await api.put(`/dtrs/time-in/${user.employee._id}/${user.employee.department}`, {timeIn : time})
            console.log(res.data)
        }catch(error){
            console.log(error)
        }
        
        
    }

    const handleTimeOut = async () => {
        const time = new Date().toLocaleTimeString()
        setTimeOut(time)
        try{
            const res = await api.put(`/dtrs/time-out/${user.employee._id}/${user.employee.department}`, {timeOut : time})
            console.log(res.data)
        }catch(error){
            console.log(error)
        }
    }

  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
        <div className="flex flex-col p-5">
            <div className="flex my-3">
                <p className='text-xl font-semibold'>{user.username.toUpperCase()}</p>
            </div>
            <div className="flex justify-center items-center my-3 bg-amber-100 w-full md:w-1/4 self-center rounded-3xl ">
                <Clock />
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>ATTENDANCE</h1>
            </div>
            <div className='flex gap-5 my-5'>
                <button onClick={handleTimeIn} disabled={timeIn} className={`w-1/2 h-20 md:h-36 rounded-full text-xl md:text-4xl ${timeIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-200 hover:bg-amber-400 hover:shadow-2xl'}`}>Time In</button>
                <button onClick={handleTimeOut} disabled={timeOut || timeIn === null} className={`w-1/2 h-20 md:h-36 rounded-full text-xl md:text-4xl ${timeOut || timeIn === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-200 hover:bg-amber-400 hover:shadow-2xl'}`}>Time Out</button>
            </div>
        </div>
    </div>
  )
}

export default HomeEmployee
