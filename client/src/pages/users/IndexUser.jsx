import React, {useState, useEffect} from 'react'
import ApiClient from '../../components/Api'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'
import DeleteModal from '../../components/DeleteModal'
import Pagination from '../../components/Pagination'
const IndexUser = () => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [removedUser, setRemovedUser] = useState({})
    const [showDeleteModal, SetShowDeleteModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] =  useState('')
    const api = ApiClient();
    let searchTimeout

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const getUsers = async (page, searchQuery) => {
          try{
            setLoading(true);
            const res = await api.get(`/users?page=${page}&search=${searchQuery}`)
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setLoading(false);
          }catch(error){
            console.log(error);
          }
      };

    useEffect(()=>{ 

        getUsers(currentPage, searchQuery);

    },[currentPage,searchQuery])

    const handleSearch = (e) => {
        clearTimeout(searchTimeout); 
        const value = e.target.value;

        searchTimeout = setTimeout(() => {
            setSearchQuery(value);
        }, 500);
    }

    const handleDelete = (user) =>{ 
        setRemovedUser(user)
        SetShowDeleteModal(true)
    }

    const handleConfirmDelete = async () =>{
        try{
            await api.delete(`/users/${removedUser._id}`)
            SetShowDeleteModal(false)
            getUsers(currentPage, searchQuery)
        }catch(error){
            SetShowDeleteModal(false)
            console.log(error)
        }
    }


  return (
    <div className="px-10 bg-slate-200 rounded-lg shadow-lg my-10">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl my-8 ">Users List</h1>
            <Link to='/users/add'>
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
                        <th className='border border-slate-600 rounded-md'>Email</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>Username</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>UserType</th>
                        <th className='border border-slate-600 rounded-md hidden md:table-cell'>Employee</th>
                        <th className='border border-slate-600 rounded-md'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) =>(
                        <tr key={user._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {(currentPage - 1) * 10 + index + 1}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {user.email}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {user.username}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {user.userType}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center hidden md:table-cell'>
                                {user.employee ? user.employee.employeeNo : ''}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <Link to={`/users/view/${user._id}`}>
                                        <BsInfoCircle className='text-2xl text-green-800 ' />
                                    </Link>
                                    <Link to={`/users/edit/${user._id}`}>
                                        <AiOutlineEdit className='text-2xl text-yellow-600 ' />
                                    </Link>
                                    <button onClick={() => handleDelete(user)}>
                                        <MdOutlineDelete className='text-2xl text-red-600 ' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && 
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
        toDelete={removedUser.email}
      />
    </div>
  )
}

export default IndexUser