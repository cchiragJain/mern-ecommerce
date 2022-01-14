import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";

import { savePaymentMethod } from "../actions/cartActions";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // if user not logged send to the login screen with redirect of shipping
  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=shipping");
    }
  }, [navigate, userInfo]);

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // if dont have a shipping Address redirect to shipping screen
  // don't need a redirect since next page is /payment
  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  // Default Payment method is PayPal
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Select Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
        </Form.Group>

        <Col>
          <Form.Check
            type="radio"
            label="PayPal or Credit Card"
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Stripe"
            id="Stripe"
            name="paymentMethod"
            value="Stripe"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Col>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
