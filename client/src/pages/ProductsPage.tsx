import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Rating,
  Skeleton,
  useTheme,
  useMediaQuery,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Slider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getProducts, Product } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { CartItem } from '../features/cart/cartSlice';
import { getCategories } from '../features/categories/categorySlice';

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter(product => 
      !showFavorites || favorites.includes(product._id)
    )
    .filter(product => 
      selectedCategory === 'all' || product.category._id === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const renderFilters = () => (
    <Box sx={{ p: 3, width: isMobile ? '100%' : 280 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
            />
          }
          label="Show Favorites Only"
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Our Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: 150, sm: 200, md: 250 } }}
          />
          <IconButton
            color="primary"
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <FilterIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0 }}>
            {renderFilters()}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      <IconButton
                        onClick={() => toggleFavorite(product._id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                      >
                        {favorites.includes(product._id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 2,
                          }}
                        >
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={4.5} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            (4.5)
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={product.brand}
                            size="small"
                            sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                          />
                          {product.countInStock > 0 ? (
                            <Chip
                              label="In Stock"
                              size="small"
                              sx={{ backgroundColor: 'success.light', color: 'success.dark' }}
                            />
                          ) : (
                            <Chip
                              label="Out of Stock"
                              size="small"
                              sx={{ backgroundColor: 'error.light', color: 'error.dark' }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ mt: 2, fontWeight: 600 }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          onClick={() => handleProductClick(product._id)}
                          sx={{ mr: 1 }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CartIcon />}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.countInStock === 0}
                          sx={{ ml: 'auto' }}
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Box>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 280,
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
          },
        }}
      >
        {renderFilters()}
      </Drawer>
    </Container>
  );
};

export default ProductsPage; 