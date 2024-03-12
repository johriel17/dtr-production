import React, { useEffect, useState } from 'react';
import ApiClient from './Api';
import { FaSave } from "react-icons/fa";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const AttendanceModal = ({ isOpen, onClose, dtrEmployeeId, employee }) => {
    const [dtrEmployeeSubs, setDtrEmployeeSubs] = useState([]);
    const [timeIn, setTimeIn] = useState({});
    const [timeOut, setTimeOut] = useState({});
    const api = ApiClient();

    const handleOutsideClick = (e) => {
        if (e.target.id === 'container') {
            onClose();
        }
    };

    useEffect(() => {
        const fetchEmployeeAttendance = async () => {
            try {
                const res = await api.get(`/dtrs/dtr-employee-subs/${dtrEmployeeId}`);
                // Parse time strings into Date objects
                const parsedData = res.data.map(attendance => ({
                    ...attendance,
                    timeIn: attendance.timeIn ? new Date(`1970-01-01T${attendance.timeIn}`) : null,
                    timeOut: attendance.timeOut ? new Date(`1970-01-01T${attendance.timeOut}`) : null
                }));
                setDtrEmployeeSubs(parsedData);
    
                // Initialize timeIn and timeOut state with fetched values
                const initialTimeIn = {};
                const initialTimeOut = {};
                parsedData.forEach(attendance => {
                    initialTimeIn[attendance._id] = attendance.timeIn;
                    initialTimeOut[attendance._id] = attendance.timeOut;
                });
                setTimeIn(initialTimeIn);
                setTimeOut(initialTimeOut);
    
            } catch (error) {
                console.log(error);
            }
        };
    
        if (isOpen) {
            fetchEmployeeAttendance();
        }
    }, [isOpen]);
    

    const handleTimeInChange = (date, attendanceId) => {
        // const { value } = event.target;
        setTimeIn(prevState => ({
            ...prevState,
            [attendanceId]: date
        }));
    };

    const handleTimeOutChange = (date, attendanceId) => {
        // const { value } = event.target;
        setTimeOut(prevState => ({
            ...prevState,
            [attendanceId]: date
        }));
    };

    const handleSaveAttendance = async (attendanceId) => {
        try {
            const timeInValue = timeIn[attendanceId] || '';
            const timeOutValue = timeOut[attendanceId] || '';

            // Send time in and time out values to backend for saving
            await api.post(`/dtrs/save-attendance/${attendanceId}`, {
                timeIn: timeInValue,
                timeOut: timeOutValue
            });

            // Optionally, you can update the UI or display a success message
            // console.log(timeInValue, timeOutValue)
            // // console.log('Attendance saved successfully');
            // console.log(timeIn, timeOut)

        } catch (error) {
            console.error('Error saving attendance:', error);
            // Handle error or display error message
        }
    };

    return isOpen && (
        <div onClick={handleOutsideClick} id="container" className="fixed inset-0 flex justify-center items-center">
            <div id='container' className="absolute inset-0 bg-black opacity-40"></div>
            {dtrEmployeeSubs && 
                <div className="relative bg-white rounded-lg shadow w-full md:w-8/12 z-50 border-2 border-amber-400">
                    <div className="flex justify-center py-5">
                        <h1 className="text-2xl font-bold text-neutral-950">Attendance</h1>
                    </div>
                    <div className="flex justify-start py-5">
                        <h1 className="text-xl font-semibold text-neutral-950 ml-3">{employee}</h1>
                    </div>
                    <table className="w-full border-y-2 border-amber-400">
                        <thead className='border'>
                            <tr>
                                <th className="py-2 px-4 text-start">Date</th>
                                <th className="py-2 px-4 text-start">Time In</th>
                                <th className="py-2 px-4 text-start">Time Out</th>
                                <th className="py-2 px-4 text-start">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dtrEmployeeSubs.map((attendance) => (
                                <tr key={attendance._id} className='border'>
                                    <td className="py-2 px-4">{new Date(attendance.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">
                                    <DatePicker
                                        selected={timeIn[attendance._id] ? new Date(timeIn[attendance._id]) : null}
                                        onChange={(date) => handleTimeInChange(date, attendance._id)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="border rounded-md"
                                    />
                                    </td>
                                    <td className="py-2 px-4">
                                    <DatePicker
                                        selected={timeOut[attendance._id] ? new Date(timeOut[attendance._id]) : null}
                                        onChange={(date) => handleTimeOutChange(date, attendance._id)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        className="border rounded-md"
                                    />
                                    </td>
                                    <td className="py-2 px-4">
                                        <button onClick={() => handleSaveAttendance(attendance._id)}>
                                            <FaSave className='text-amber-400' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
};

export default AttendanceModal;
