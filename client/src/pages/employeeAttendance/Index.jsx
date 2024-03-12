import React, { useEffect, useState } from 'react'
import ApiClient from '../../components/Api'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { BsInfoCircle } from 'react-icons/bs'
import Pagination from '../../components/Pagination'

const Index = () => {

  const api = ApiClient()

  const [dtrs, setDtrs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] =  useState('')
  let searchTimeout

  const goToPage = (page) => {
      setCurrentPage(page);
  };

  const fetchAttendances = async(page, searchQuery) => {
    try{
      setLoading(true)
      const res = await api.get(`/employee-attendances`)
      const dtrs = res.data.dtrs.map((dtrEmployee) => {return dtrEmployee.dtr})
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setDtrs(dtrs)
      setLoading(false)
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {

    fetchAttendances(currentPage,searchQuery)

  }, [currentPage, searchQuery])

  const handleSearch = (e) => {
    clearTimeout(searchTimeout); 
    const value = e.target.value;

    searchTimeout = setTimeout(() => {
        setSearchQuery(value);
    }, 500);
}

  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl my-8 ">Attendance List</h1>
        </div>
        <div className="flex justify-end items-center">
        <input type="text" placeholder='Search...' onChange={handleSearch} className="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 md:w-1/4 p-2.5 "/>
        </div>

        {loading ? (
            <Spinner />
        ) : (
            <>
            <table className='w-full border-separate border-spacing-2 py-5'>
                <thead>
                    <tr>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>No.</th>
                        <th className='border border-slate-600 rounded-md'>DTR No.</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>Start Date</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>End Date</th>
                        <th className='border border-slate-600 rounded-md'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dtrs.map((dtr, index) =>(
                        <tr key={dtr._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {(currentPage - 1) * 10 + index + 1}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {dtr.dtrNum}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {new Date(dtr.startDate).toLocaleDateString()}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {new Date(dtr.endDate).toLocaleDateString()}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <Link to={`/attendances/view/${dtr._id}`}>
                                        <BsInfoCircle className='text-2xl text-green-800 ' />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {dtrs.length === 0 && 
                    <tr className="h-8">
                        <td className="border border-slate-700 rounded-md text-center" colSpan="12">
                                No data available!
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
            }

            </>
        )}
    </div>
  )
}

export default Index