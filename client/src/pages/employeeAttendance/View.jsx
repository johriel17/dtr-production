import React, {useState, useEffect}from 'react'
import ApiClient from '../../components/Api'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Spinner from '../../components/Spinner'

const View = () => {

  const [dtr, setDtr] = useState({})
  const [dtrEmployeeSubs, setDtrEmployeeSubs] = useState([])
  const [loading, setLoading] = useState(false)
  const {id} = useParams()
  const api = ApiClient()

  const converTime = (timeString) => {

    if(timeString){
        const [hours, minutes] = timeString.split(":");
        const formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
    
        return formattedTime
    }

    return null
  }

  useEffect(() => {

    const fetchData = async () => {
      try{
        setLoading(true)
        const res = await api.get(`/employee-attendances/${id}`)
        setDtr(res.data.dtr)
        setDtrEmployeeSubs(res.data.dtrEmployeeSubs)
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
      <BackButton destination={'/attendances'}/>
      <div className="flex justify-center items-center">
          <h3 className="text-2xl my-8 font-extrabold">View Attendance</h3>
      </div>
      {loading ? 

      (
        <Spinner/>
      )
      :
      (
        <>
        <div className='flex flex-col'>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>DTR No.</span>
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
        </div>

        <table className='w-full border-separate border-spacing-2 py-5'>
                <thead>
                    <tr>
                        <th className='border border-slate-600 rounded-md'>Date</th>
                        <th className='border border-slate-600 rounded-md'>Time In</th>
                        <th className='border border-slate-600 rounded-md'>Time Out</th>
                    </tr>
                </thead>
                <tbody>
                    {dtrEmployeeSubs?.map((dtrEmployeeSub) =>(
                        <tr key={dtrEmployeeSub._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {new Date(dtrEmployeeSub.date).toLocaleDateString()}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {converTime(dtrEmployeeSub.timeIn)}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {converTime(dtrEmployeeSub.timeOut)}
                            </td>
                        </tr>
                    ))}
                    {dtrEmployeeSubs?.length === 0 && 
                    <tr className="h-8">
                        <td className="border border-slate-700 rounded-md text-center" colSpan="12">
                                No data available!
                        </td>
                    </tr>
                    }
                </tbody>
            </table>

        </>
      )

      }
    </div>
  )
}

export default View
