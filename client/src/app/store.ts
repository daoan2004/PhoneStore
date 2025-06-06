import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/categories/categorySlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import orderReducer from '../features/orders/orderSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    reviews: reviewReducer,
    orders: orderReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 