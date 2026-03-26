import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {

  const [list, setList] = useState([]);
  const fetchlist=async()=>{
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if(response.data.success){
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch product list");
      }
    } catch (error) {
      toast.error("Error fetching product list:", error.response?.data?.message || error.message);
    }
  }

  const removeProduct=async(id)=>{
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`,{id},{headers: { Authorization: `Bearer ${token}` }});
      if(response.data.success){
        toast.success(response.data.message);
        await fetchlist();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      toast.error("Error removing product:", error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchlist();
  }, [])

  
  return (
    <>
    <p className='mb-2'>Product List</p>
    <div className='flex flex-col gap-2'>

      {/* List Table Title */}
      <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
        
      </div>

      {list.map((item,index)=>(
          <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
            <img className='w-6 h-6 object-cover rounded' src={item.image[0]} alt={item.name} />
            <p className='items-center'>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeProduct(item._id)} className='cursor-pointer text-red-500'>X</p>
            
          </div>
        ))}

    </div>
      
    </>
  )
}

export default List
