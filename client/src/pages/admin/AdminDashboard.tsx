import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrderIcon,
  Person as UserIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProducts } from '../../features/products/productSlice';
import { getCategories } from '../../features/categories/categorySlice';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: InventoryIcon,
      color: '#2563eb',
    },
    {
      title: 'Total Categories',
      value: categories.length,
      icon: CategoryIcon,
      color: '#7c3aed',
    },
    {
      title: 'Total Orders',
      value: '0',
      icon: OrderIcon,
      color: '#059669',
    },
    {
      title: 'Total Revenue',
      value: '$0',
      icon: RevenueIcon,
      color: '#dc2626',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome to the admin dashboard. Manage your store from here.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {React.createElement(stat.icon, {
                  sx: { fontSize: 40, color: stat.color, mr: 2 },
                })}
                <Box>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Categories</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Manage product categories, add new ones, or update existing categories.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/admin/categories"
                variant="contained"
                fullWidth
              >
                Manage Categories
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Products</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Manage your product inventory, add new products, or update existing ones.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/admin/products"
                variant="contained"
                fullWidth
              >
                Manage Products
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Orders</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View and manage customer orders, track shipments, and handle returns.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/admin/orders"
                variant="contained"
                fullWidth
              >
                Manage Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 