import React from 'react';
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
} from '@mui/material';
import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome to the admin dashboard. Manage your store from here.
        </Typography>
      </Box>

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
                <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Overview</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View store statistics, sales reports, and other important metrics.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to="/admin/dashboard"
                variant="contained"
                fullWidth
              >
                View Dashboard
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 