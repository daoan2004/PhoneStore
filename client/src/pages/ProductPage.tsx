import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  SupportAgent as SupportAgentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getProductById } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Product, Review } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useAppSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.countInStock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      navigate('/cart');
    }
  };

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Free Shipping',
      description: 'On orders over $100',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payment',
      description: '100% secure payment',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Dedicated support',
    },
  ];

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <Box
              component="img"
              src={product?.image}
              alt={product?.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: 2,
                backgroundColor: 'white',
                p: 4,
              }}
            />
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </>
          ) : (
            <Box>
              <Typography variant="h4" gutterBottom>
                {product?.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={product?.brand}
                  size="small"
                  sx={{ backgroundColor: theme.palette.primary.light, color: 'white' }}
                />
                <Chip
                  label={product?.countInStock ? 'In Stock' : 'Out of Stock'}
                  size="small"
                  color={product?.countInStock ? 'success' : 'error'}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product?.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product?.numReviews} reviews)
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ${product?.price?.toFixed(2)}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: product?.countInStock }}
                    sx={{ width: 80 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product?.countInStock || 0)}
                  >
                    <AddIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    {product?.countInStock} items available
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product?.countInStock}
                fullWidth
                sx={{ mb: 3 }}
              >
                Add to Cart
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* Features */}
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ color: 'primary.main', mb: 1 }}>{feature.icon}</Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        {/* Product Information Tabs */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant={isMobile ? 'fullWidth' : 'standard'}
            >
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1">{product?.description}</Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Brand
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {product?.brand}
                </Typography>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Category
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {product?.category.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Model
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {product?.name}
                </Typography>

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Stock Status
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {product?.countInStock ? `${product.countInStock} units in stock` : 'Out of stock'}
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {(product as Product)?.reviews && (product as Product).reviews.length > 0 ? (
              <Box>
                {(product as Product).reviews.map((review: Review) => (
                  <Box key={review._id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No reviews yet.
              </Typography>
            )}
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage; 