import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-1 border-gray-300'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center gap-3 p-2 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/add'>
          <img className='w-4 h-5' src={assets.add_icon} alt="" />
          <p className=''> Add Items</p>
        </NavLink>
        <hr />

        <NavLink className='flex items-center gap-3 p-2 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/list'>
          <img className='w-4 h-5' src={assets.order_icon} alt="" />
          <p className=''> List Items</p>
        </NavLink>
        <hr />

        <NavLink className='flex items-center gap-3 p-2 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/orders'>
          <img className='w-4 h-5' src={assets.order_icon} alt="" />
          <p className=''> Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
