import React from 'react'
import { MdNavigateNext, MdNavigateBefore, MdFirstPage, MdLastPage } from "react-icons/md";
const Pagination = ({ currentPage, totalPages, goToPage}) => {
  return (
    <div className="flex flex-col justify-center items-center"> 
        <div className='flex justify-center items-center pt-5 pb-2'>
            <button disabled={currentPage === 1} className='bg-slate-400 rounded-2xl mx-2' onClick={() => goToPage(1)}><MdFirstPage size={30} /></button>
            <button disabled={currentPage === 1} className='bg-slate-400 rounded-2xl' onClick={() => goToPage(currentPage - 1)}><MdNavigateBefore size={30} /></button>
                {/* {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === currentPage || page === totalPages)
                    .map((page) => (
                        <button key={page} onClick={() => goToPage(page)} className={currentPage === page ? 'active' : ''}>
                            <span className={currentPage === page ? 'text-xl font-semibold text-cyan-950' : ''}>{page}</span>
                        </button>
                ))} */}
                <button onClick={() => goToPage(page)} className="active mx-8">
                    <span className='text-xl font-semibold text-cyan-950'>{currentPage}</span>
                </button>
            <button disabled={currentPage >= totalPages} className='bg-slate-400 rounded-2xl mx-2' onClick={() => goToPage(currentPage + 1)}><MdNavigateNext size={30} /></button>
            <button disabled={currentPage === totalPages} className='bg-slate-400 rounded-2xl' onClick={() => goToPage(totalPages)}><MdLastPage size={30} /></button>
        </div>  
        <div className='mb-5'>
            <span className='text-xs font-thin'>page {currentPage} out of {totalPages}</span>
        </div>  
    </div>
  )
}

export default Pagination