import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  Paper,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  AddShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getProductById } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { getReviews } from '../features/reviews/reviewSlice';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, loading: productLoading } = useAppSelector((state) => state.products);
  const { reviews } = useAppSelector((state) => state.reviews);
  const { user } = useAppSelector((state) => state.auth);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getReviews());
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality
  };

  const productReviews = reviews.filter((review) => review.product._id === id);
  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((acc, review) => acc + review.rating, 0) /
          productReviews.length
        ).toFixed(1)
      : 0;

  if (productLoading || !product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <IconButton
                onClick={handleToggleFavorite}
                color="primary"
                sx={{ '&:hover': { transform: 'scale(1.1)' } }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={Number(averageRating)} precision={0.5} readOnly />
              <Typography color="text.secondary">
                ({productReviews.length} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                label={product.category.name}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${product.countInStock} in stock`}
                color={product.countInStock > 0 ? 'success' : 'error'}
                variant="outlined"
              />
              {product.isFeatured && (
                <Chip label="Featured" color="secondary" variant="outlined" />
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              fullWidth
              sx={{ mb: 2 }}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {user && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={() => setReviewDialogOpen(true)}
              >
                Write a Review
              </Button>
            )}
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Customer Reviews
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {!user && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Please log in to write a review
              </Alert>
            )}

            {product && (
              <ReviewList productId={id || ''} reviews={productReviews} />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <ReviewForm
        productId={id || ''}
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      />
    </Container>
  );
};

export default ProductPage; 