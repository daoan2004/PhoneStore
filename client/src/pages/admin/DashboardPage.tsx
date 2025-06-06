import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProducts } from '../../features/products/productSlice';
import { getCategories } from '../../features/categories/categorySlice';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getProducts()),
          dispatch(getCategories()),
          // Add more data fetching here
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const stats: StatCard[] = [
    {
      title: 'Total Sales',
      value: '$12,500',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      trend: 12.5,
      color: theme.palette.primary.main,
    },
    {
      title: 'Total Orders',
      value: '150',
      icon: <CartIcon sx={{ fontSize: 40 }} />,
      trend: 8.2,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Total Customers',
      value: '1,250',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      trend: -2.4,
      color: theme.palette.success.main,
    },
    {
      title: 'Products in Stock',
      value: products.length,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      trend: 5.7,
      color: theme.palette.warning.main,
    },
  ];

  const lowStockProducts = products
    .filter((product) => product.countInStock < 10)
    .slice(0, 5);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={stat.trend >= 0 ? 'success.main' : 'error.main'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {stat.trend >= 0 ? (
                          <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                        )}
                        {Math.abs(stat.trend)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders & Low Stock Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No recent orders
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell align="right">${order.amount}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Low Stock Products
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No low stock products
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.countInStock}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 