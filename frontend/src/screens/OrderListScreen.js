import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";

import { listOrders } from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Title from "../components/Title";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // if not logged in or not a admin send to the login page
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  // get all orders on first load
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <>
      <Title title="All Orders | Admin" />
      <h1>All Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        // Table ref -> https://react-bootstrap.github.io/components/table/
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIEVERED</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>&#8377; {order.totalPrice}</td>
                <td>
                  {/* if paid show date else red cross icon */}
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {/* if Delivered show date else red cross icon */}
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {/* no need to create a new screen for admin only access this path loads the OrderScreen.js */}
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="outline-primary" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
