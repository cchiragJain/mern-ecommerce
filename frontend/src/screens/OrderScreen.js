import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";

import {
  getOrderDetails,
  payOrder,
  resetPayOrder,
  deliverOrder,
  resetDeliverOrder,
} from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get id from url
  const { id: orderId } = useParams();

  // if not logged in send to login and then redirect to current page with the same order id
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (!userInfo) {
      navigate(`/login`);
    }
  }, [navigate, userInfo]);

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  // will get new order details and not use the old ones
  useEffect(() => {
    // console.log("first vaala run ho raha h");
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  /* PAYPAL SCRIPT */
  // only loads on first render
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };

      // add body to the script
      document.body.appendChild(script);
    };

    addPayPalScript();
  }, []);

  /* CHECK PAYMENT */
  useEffect(() => {
    // if don't have a order or we get successPay dispatch to get new details
    if (!order || successPay) {
      dispatch(resetPayOrder());
      dispatch(getOrderDetails(orderId));
      // console.log("orderafter,spay", order, successPay);
    }
  }, [dispatch, orderId, order, successPay]);

  // paymentResult is returned from paypal
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  /* CHECK DELIVER */
  useEffect(() => {
    if (!order || successDeliver) {
      // on successDeliver reset the state and get new details
      dispatch(resetDeliverOrder());
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, successDeliver, order, orderId]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      {/* on click go back to the previous page
        /profile for users access
        /admin/orderlist for admin access
      */}
      <Button className="btn btn-dark my-3" onClick={() => navigate(-1)}>
        Go back
      </Button>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {order.user.name}</strong>
              </p>
              <p>
                <strong>Email: {order.user.email}</strong>
              </p>
              <p>
                <strong>Address : </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {/* check if delievered */}
              {order.isDelivered ? (
                <Message variant="success">
                  Delievered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delievered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {/* check if paid */}
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x &#8377;{item.price} = &#8377;
                        {item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#8377;{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#8377;{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax (18%)</Col>
                  <Col>&#8377;{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8377;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {/* ADMIN DELIVER BUTTON 
                  Show only if user is admin, order is paid and not yet delivered
              */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="submit"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
