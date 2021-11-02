import React from "react";
import {
  useLocation
} from "react-router-dom";

function ShopifyRedirect() {
  const queryStr = useLocation().search;
  const query = new URLSearchParams(queryStr);
  const [customers, setCustomers] = React.useState([]);

  const shop = query.get('shop');

  const getAccessToken = async() => {
      await fetch(`${process.env.REACT_APP_API_URI}/access_token${queryStr}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      .then((res) => res.json())
      .then(async(res) => {
         if (!res.error) {
           localStorage.setItem('shopifyAccessToken', res.data.access_token);

           await fetch(`${process.env.REACT_APP_API_URI}/top_customers_by_order?shop=${shop}&access_token=${res.data.access_token}`)
           .then((res) => res.json())
           .then(topCustomersByOrder => {
              if (topCustomersByOrder && topCustomersByOrder.data.length) {
                setCustomers(topCustomersByOrder.data);
              }
           })
         }
       })
    return false;
  }
  
  React.useEffect(() => {
    if (queryStr.length > 0 && !customers.length) {
      getAccessToken();
    }
  });

  return (
    <>
        {!customers.length && <span>Loading...</span>}
        <ul>
          {customers.map((customer, index) => {
            return (
              <li key={index}>{`${index+1}. ${customer.first_name} ${customer.last_name} - ${customer.email} - Orders count: ${customer.orders_count}`}</li>
            )
          })}
        </ul>
    </>
  );
}

export default ShopifyRedirect;
