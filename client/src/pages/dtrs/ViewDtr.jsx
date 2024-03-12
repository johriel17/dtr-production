import React, {useState, useEffect}from 'react'
import ApiClient from '../../components/Api'
import { useParams, Link } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Spinner from '../../components/Spinner'
import { BsInfoCircle } from 'react-icons/bs'
import AttendanceModal from '../../components/AttendanceModal'

const ViewDtr = () => {

  const [dtr, setDtr] = useState({})
  const [dtrEmployees, setDtrEmployees] = useState([])
  const [dtrEmployee, setDtrEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const {id} = useParams()
  const api = ApiClient()

  useEffect(() => {

    const fetchData = async () => {
      try{
        setLoading(true)
        const res = await api.get(`/dtrs/${id}`)
        setDtr(res.data.dtr)
        setDtrEmployees(res.data.dtrEmployees)
        setLoading(false)
      }catch(error){
        setLoading(false)
        console.log(error)
      }
    }

    fetchData()

  }, [])

  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
      <BackButton destination={'/dtrs'}/>
      <div className="flex justify-center items-center">
          <h3 className="text-2xl my-8 font-extrabold">View Daily Time Record</h3>
      </div>
      {loading ? 

      (
        <Spinner/>
      )
      :
      (
        <div className='flex flex-col'>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>Dtr Number</span>
            <span className='font-semibold'>{dtr.dtrNum}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>Start Date</span>
            <span className='font-semibold'>{new Date(dtr.startDate).toLocaleDateString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>End Date</span>
            <span className='font-semibold'>{new Date(dtr.endDate).toLocaleDateString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>Department</span>
            {dtr.department && <span className='font-semibold'>{dtr.department.name}</span>}
          </div>

          <table className='w-full border-separate border-spacing-2 py-5'>
                <thead>
                    <tr>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>No.</th>
                        <th className='border border-slate-600 rounded-md'>Employee</th>
                        <th className='border border-slate-600 rounded-md'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dtrEmployees?.map((dtrEmployee, index) =>(
                        <tr key={dtrEmployee._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {/* {(currentPage - 1) * 10 + index + 1} */}
                                {index + 1}
                            </td>
                            {dtrEmployee.employee && 
                              <td className='border border-slate-700 rounded-md text-center'>
                                {`${dtrEmployee.employee.lastName}, ${dtrEmployee.employee.firstName} ${dtrEmployee.employee.middleName}`}
                            </td>
                            }
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <button onClick={() => {setShowAttendanceModal(true), setDtrEmployee(dtrEmployee)}}>
                                        <BsInfoCircle className='text-2xl text-green-800 ' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {dtrEmployees?.length === 0 && 
                    <tr className="h-8">
                        <td className="border border-slate-700 rounded-md text-center" colSpan="12">
                                No data available!
                        </td>
                    </tr>
                    }
                </tbody>
            </table>

        </div>
      )

      }
      <AttendanceModal 
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        employee={dtrEmployee ? `${dtrEmployee.employee.lastName}, ${dtrEmployee.employee.firstName} ${dtrEmployee.employee.middleName}` : ""}
        dtrEmployeeId={dtrEmployee ? dtrEmployee._id : ""}
       />
    </div>
  )
}

export default ViewDtr
