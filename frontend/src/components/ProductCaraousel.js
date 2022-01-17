import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";

import { listTopProducts } from "../actions/productActions";
import Loader from "./Loader";
import Message from "./Message";

const ProductCaraousel = () => {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="error">{error}</Message>
  ) : (
    <Carousel
      pause="hover"
      style={{
        background: "linear-gradient(to right, #283048, #859398)",
        boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
        backdropFilter: "blur( 20px )",
        border: "1px solid rgba( 255, 255, 255, 0.18 )",
      }}
    >
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="caraousel-caption">
              <h2>
                {product.name} (&#8377;{product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCaraousel;
