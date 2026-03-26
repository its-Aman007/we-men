import { assets } from '../assets/assets.js'


const Navbar = ({ setToken }) => {
    return (
    <div className='w-full h-[80px] bg-gray-800 flex items-center justify-between px-5 sm:px-10'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm ' onClick={() => setToken("")}>
            Logout
        </button>


    </div>
)
}

export default Navbar
