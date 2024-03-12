import { Link } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"

const BackButton = ({ destination }) => {
  return (
    <div className="flex ">
        <Link to={destination} className="bg-sky-400 mt-10 px-4 py-1 rounded-lg w-fit" >
            <BsArrowLeft/>
        </Link>
    </div>
  )
}


export default BackButton