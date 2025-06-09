import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Container,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as ProductIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Sản phẩm', icon: <PhoneIcon />, path: '/products' },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          width: 240,
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Phone Store
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              onClick={handleMobileMenuToggle}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        Hồ sơ
      </MenuItem>
      {user?.role === 'admin' && (
        <MenuItem onClick={() => { handleClose(); navigate('/admin/dashboard'); }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Quản trị
        </MenuItem>
      )}
      <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="primary"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PhoneIcon /> Phone Store
          </Typography>

          {!isMobile && user && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ color: 'text.primary' }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="primary"
                component={RouterLink}
                to="/cart"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={items.length} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              {userMenu}
            </Box>
          ) : (
            <Box>
              <Button
                color="primary"
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Đăng nhập
              </Button>
              <Button
                color="primary"
                component={RouterLink}
                to="/register"
                variant="contained"
              >
                Đăng ký
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      {renderMobileMenu()}
    </AppBar>
  );
};

export default Header; 