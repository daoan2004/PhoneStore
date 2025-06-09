import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Tooltip,
  CircularProgress,
  InputAdornment,
  Chip,
  Stack,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productSlice';
import { getCategories } from '../../features/categories/categorySlice';
import { Product } from '../../types';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  brand: string;
  countInStock: number;
  category: string;
  isFeatured: boolean;
  image: string;
  soldCount: number;
}

const ProductManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  
  // States cho file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    brand: '',
    countInStock: 0,
    category: '',
    isFeatured: false,
    image: '',
    soldCount: 0,
  });

  // Function upload to Pinata
  const uploadToPinata = async (file: File): Promise<string> => {
    if (!file) {
      throw new Error('No file provided');
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `5b9afb41a6a64bcad1f7`,
          pinata_secret_api_key: `080a3e13f1c8a9527e3ff8faaeb9871b5df53900099d88edba2259f98be701ec`,
          "Content-Type": "multipart/form-data",
        }
      });

      if (!response.data?.IpfsHash) {
        throw new Error('No IPFS hash returned from Pinata');
      }

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("Image successfully uploaded to Pinata:", ImgHash);
      return ImgHash;
    } catch (error: any) {
      console.error("Pinata upload error:", error.response?.data || error.message);
      setErrorMessage("Unable to upload image to Pinata");
      setOpenError(true);
      throw error;
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Vui lòng chọn file ảnh hợp lệ');
        setOpenError(true);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Kích thước file không được vượt quá 5MB');
        setOpenError(true);
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.countInStock - b.countInStock;
        case 'stock-desc':
          return b.countInStock - a.countInStock;
        case 'sold-desc':
          return (b.soldCount || 0) - (a.soldCount || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleClickOpen = () => {
    setOpen(true);
    setIsEdit(false);
    setSelectedFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: 0,
      brand: '',
      countInStock: 0,
      category: '',
      isFeatured: false,
      image: '',
      soldCount: 0,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setIsEdit(true);
    setSelectedProduct(product);
    setSelectedFile(null);
    setImagePreview(product.image);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      countInStock: product.countInStock,
      category: product.category._id,
      isFeatured: product.isFeatured || false,
      image: product.image,
      soldCount: product.soldCount || 0,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        dispatch(getProducts());
      } catch (error: any) {
        alert(error.message || 'Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);

    try {
      // Validate numeric fields
      if (formData.price < 0) {
        alert('Price cannot be negative');
        return;
      }

      if (formData.countInStock < 0) {
        alert('Stock cannot be negative');
        return;
      }

      // Find the selected category object
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      if (!selectedCategory) {
        alert('Please select a valid category');
        return;
      }

      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        try {
          imageUrl = await uploadToPinata(selectedFile);
        } catch (error) {
          console.error('Failed to upload image:', error);
          setUploadLoading(false);
          return;
        }
      }

      // Validate image URL
      if (!imageUrl) {
        alert('Vui lòng chọn ảnh sản phẩm');
        setUploadLoading(false);
        return;
      }

      const productData: Partial<Product> = {
        ...formData,
        image: imageUrl,
        category: {
          _id: selectedCategory._id,
          name: selectedCategory.name,
          slug: selectedCategory.name.toLowerCase().replace(/\s+/g, '-')
        }
      };

      if (isEdit && selectedProduct) {
        await dispatch(updateProduct({ id: selectedProduct._id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      
      handleClose();
      dispatch(getProducts());
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    const newValue = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' 
      ? e.target.checked 
      : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Product
        </Button>
      </Box>

      {/* Search and Filter Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            <MenuItem value="price-asc">Price (Low to High)</MenuItem>
            <MenuItem value="price-desc">Price (High to Low)</MenuItem>
            <MenuItem value="stock-asc">Stock (Low to High)</MenuItem>
            <MenuItem value="stock-desc">Stock (High to Low)</MenuItem>
            <MenuItem value="sold-desc">Best Selling</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Box sx={{ pt: '100%', position: 'relative' }}>
                  <CircularProgress
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          filteredAndSortedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'contain', p: 2 }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {product.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      size="small"
                      label={`$${product.price}`}
                      color="primary"
                      icon={<LocalOfferIcon />}
                    />
                    <Chip
                      size="small"
                      label={`Stock: ${product.countInStock}`}
                      color={product.countInStock > 0 ? 'success' : 'error'}
                      icon={<InventoryIcon />}
                    />
                  </Stack>
                  <Chip
                    size="small"
                    label={product.category.name}
                    icon={<CategoryIcon />}
                    sx={{ mb: 1 }}
                  />
                  {product.soldCount > 0 && (
                    <Chip
                      size="small"
                      label={`Sold: ${product.soldCount}`}
                      color="secondary"
                      sx={{ ml: 1, mb: 1 }}
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Product' : 'Create New Product'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="countInStock"
                  label="Stock"
                  type="number"
                  fullWidth
                  required
                  value={formData.countInStock}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="brand"
                  label="Brand"
                  type="text"
                  fullWidth
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Image Upload Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Ảnh sản phẩm
              </Typography>
              
              {/* Image Preview */}
              {(imagePreview || formData.image) && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                </Box>
              )}

              {/* File Upload Button */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadLoading}
                >
                  {selectedFile ? 'Đổi ảnh' : 'Chọn ảnh'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
                
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile.name}
                  </Typography>
                )}
                
                {uploadLoading && (
                  <CircularProgress size={20} />
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Chọn file ảnh (JPEG, PNG, GIF). Tối đa 5MB.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: 'isFeatured', value: e.target.checked },
                    })
                  }
                  name="isFeatured"
                />
              }
              label="Featured Product"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit" disabled={uploadLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={uploadLoading}
              startIcon={uploadLoading ? <CircularProgress size={16} /> : null}
            >
              {uploadLoading ? 'Đang tải...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductManagementPage; 