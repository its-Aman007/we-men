import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const Order = ({token}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders=async()=>{
    if(!token){
      return;
    }
    try {
      const response = await axios.get(
        `${backendUrl}/api/orders/list`,
        {headers: { Authorization: `Bearer ${token}` }}
      );
      console.log(response.data);
      if (response.data.success) {
        setOrders(response.data.orders.reverse());

      }else {
        toast.error(response.data.message);
      }

      

    } catch (error) {
      toast.error(error.message);
    }

  }

  const handleStatusChange = async (orderId, status) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/orders/status`,
      { orderId, status:event.target.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      toast.success("Status Updated Successfully");
      fetchAllOrders(); // refresh UI
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    fetchAllOrders();
  }, []);

  
  return (
  <div className="p-5">
    <h3 className="text-xl font-semibold mb-4">Order Page</h3>

    <div className="flex flex-col gap-5">
      {orders.map((order, index) => (
        <div
          key={index}
          className="grid grid-cols-[80px_2fr_1fr_120px_150px] items-center gap-4 border p-4 rounded-md shadow-sm"
        >
          {/* Icon */}
          <img
            src={assets.parcel_icon}
            alt=""
            className="w-12 h-8 object-contain"
          />

          {/* Items + Address */}
          <div className="text-sm text-gray-700">
            <div className="py-0.5">
              {order.items.map((item, i) => (
                <span key={i}>
                  {item.name} x {item.quantity} {item.size}
                  {i !== order.items.length - 1 && ", "}
                </span>
              ))}
            </div>

            <p className="mt-3 mb-2 font-medium">
              {order.address.firstName} {order.address.lastName}
            </p>

            <p>
              {order.address.street}, {order.address.city},{" "}
              {order.address.state}, {order.address.country},{" "}
              {order.address.zipCode}
            </p>

            <p>{order.address.phone}</p>
          </div>

          {/* Order Info */}
          <div className="text-sm text-gray-700">
            <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
            <p className='mt-3'>Method : {order.paymentMethod}</p>
            <p>Payment : {order.payment ? "Done" : "Pending"}</p>
            <p>
              Date :{" "}
              {new Date(order.date).toLocaleDateString()}
            </p>
            {/* <p>currency : {order.currency}</p> */}
          </div>

          {/* Amount */}
          <div className="text-sm sm:text-[15px]">
            ${order.totalAmount}
          </div>

          {/* Status Dropdown */}
          <select value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)} className="border px-2 py-1 rounded">
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  </div>
);
}
export default Order
