import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";

import {
  listProducts,
  deleteProduct,
  createProduct,
  resetCreateProduct,
} from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ProductListScreen = () => {
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

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  console.log(productCreate);
  const {
    loading: loadingCreate,
    success: successCreate,
    product: createdProduct,
    error: errorCreate,
  } = productCreate;

  // list all products on first load or if successDelete changes
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successDelete]);

  useEffect(() => {
    // resetting to let new products be created
    dispatch(resetCreateProduct());
    if (successCreate) {
      // navigate to the edit page
      navigate(`/admin/product/${createdProduct._id}/edit`);
    }
  }, [dispatch, navigate, successCreate, createdProduct]);

  const createProductHandler = () => {
    console.log("product created");
    dispatch(createProduct());
  };

  const deleteProductHandler = (productId) => {
    // puts a confirmation window
    if (window.confirm("Are you sure you want to delete the product?")) {
      // call delete handler
      dispatch(deleteProduct(productId));
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="my-3"
            variant="outline-primary"
            onClick={createProductHandler}
          >
            <i className="fas fa-plus" /> Create New Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
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
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>&#8377; {product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit" />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-smm"
                    onClick={() => deleteProductHandler(product._id)}
                  >
                    <i className="fas fa-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
