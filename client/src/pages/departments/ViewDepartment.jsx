import React, {useState, useEffect}from 'react'
import ApiClient from '../../components/Api'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Spinner from '../../components/Spinner'

const ViewDepartment = () => {

  const [department, setDepartment] = useState({})
  const [loading, setLoading] = useState(false)
  const {id} = useParams()
  const api = ApiClient()

  useEffect(() => {

    const fetchData = async () => {
      try{
        setLoading(true)
        const res = await api.get(`/departments/${id}`)
        setDepartment(res.data)
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
      <BackButton destination={'/departments'}/>
      <div className="flex justify-center items-center">
          <h3 className="text-2xl my-8 font-extrabold">View Department</h3>
      </div>
      {loading ? 

      (
        <Spinner/>
      )
      :
      (
        <div className='flex flex-col'>
          <div className='my-4'>
            <span className='text-xl mr-4 font-bold'>Department Name</span>
            <span className='font-semibold'>{department.name}</span>
          </div>
        </div>
      )

      }
    </div>
  )
}

export default ViewDepartment
