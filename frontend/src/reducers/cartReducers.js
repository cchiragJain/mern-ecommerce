import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      const existsItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existsItem) {
        // return the exisiting state with adjusted cartitems
        return {
          ...state,
          /* map through the cardItems array and replace the matching product with the new item leave the rest products as it is */
          cartItems: state.cartItems.map((x) =>
            x.product === existsItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          /* if does'nt exist already add it to the cartItems */
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    default:
      return state;
  }
};
