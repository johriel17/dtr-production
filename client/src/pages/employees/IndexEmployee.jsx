import React, {useState, useEffect} from 'react'
import ApiClient from '../../components/Api'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'
import DeleteModal from '../../components/DeleteModal'
import Pagination from '../../components/Pagination'
const IndexEmployee = () => {

    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [removedEmployee, setRemovedEmployee] = useState({})
    const [showDeleteModal, SetShowDeleteModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')
    const api = ApiClient()
    let searchTimeout


    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const getEmployees = async(page,searchQuery) =>{

        try{
            setLoading(true)
            const res = await api.get(`/employees?page=${page}&search=${searchQuery}`)
            setEmployees(res.data.employees);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setLoading(false)
        }catch(error){
            console.log(error)
        }

    }

    useEffect(()=>{ 
        getEmployees(currentPage,searchQuery)
    },[currentPage,searchQuery])

    const handleSearch = (e) => {
        clearTimeout(searchTimeout); 
        const value = e.target.value;

        searchTimeout = setTimeout(() => {
            setSearchQuery(value);
        }, 500);
    }

    const handleDelete = (employee) =>{ 
        setRemovedEmployee(employee)
        SetShowDeleteModal(true)
    }

    const handleConfirmDelete = async () =>{
        try{
            await api.delete(`/employees/${removedEmployee._id}`)
            SetShowDeleteModal(false)
            getEmployees(currentPage,searchQuery)
        }catch(error){
            SetShowDeleteModal(false)
            console.log(error)
        }
    }


  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl my-8 ">Dtrs List</h1>
            <Link to='/employees/add'>
                <MdOutlineAddBox className='text-sky-800 text-4xl' />
            </Link>
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
                        <th className='border border-slate-600 rounded-md'>Employee No.</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>Employee Name</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>Department</th>
                        <th className='border border-slate-600 rounded-md'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) =>(
                        <tr key={employee._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {(currentPage - 1) * 10 + index + 1}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {employee.employeeNo}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {`${employee.lastName}, ${employee.firstName} ${employee.middleName}`}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {employee.department ? employee.department.name : ''}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <Link to={`/employees/view/${employee._id}`}>
                                        <BsInfoCircle className='text-2xl text-green-800 ' />
                                    </Link>
                                    <Link to={`/employees/edit/${employee._id}`}>
                                        <AiOutlineEdit className='text-2xl text-yellow-600 ' />
                                    </Link>
                                    <button onClick={() => handleDelete(employee)}>
                                        <MdOutlineDelete className='text-2xl text-red-600 ' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {employees.length === 0 && 
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
        <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => SetShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        toDelete={removedEmployee.employeeNo}
      />
    </div>
  )
}

export default IndexEmployee