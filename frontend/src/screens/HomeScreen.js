import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();

  // if get a keyword for the search result
  const keyword = useParams();

  const { loading, error, products } = useSelector(
    (state) => state.productList
  );

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      <h1>Latest Products</h1>
      {/* if loading true display loading if false check error and display if true if error false display the component */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="info">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col
              sm={12}
              md={6}
              lg={4}
              xl={3}
              className="align-items-stretch d-flex"
              key={product._id}
            >
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomeScreen;
