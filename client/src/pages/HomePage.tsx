import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  CreditCard as PaymentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $50',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: '100% secure payment processing',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Dedicated support anytime',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.main',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?smartphone)',
          minHeight: { xs: 300, md: 500 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            py: { xs: 4, md: 8 },
            minHeight: { xs: 300, md: 500 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontWeight: 700,
              maxWidth: 600,
            }}
          >
            Discover the Latest Smartphones
          </Typography>
          <Typography
            variant="h5"
            color="inherit"
            paragraph
            sx={{
              maxWidth: 600,
              mb: 4,
              fontSize: { xs: '1rem', md: '1.5rem' },
            }}
          >
            Explore our wide selection of premium phones from top brands
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/products')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              width: 'fit-content',
              fontSize: { xs: '1rem', md: '1.2rem' },
              py: { xs: 1, md: 1.5 },
              px: { xs: 3, md: 4 },
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Popular Categories
        </Typography>
        <Grid container spacing={4}>
          {['Apple', 'Samsung', 'Google', 'OnePlus'].map((brand) => (
            <Grid item xs={12} sm={6} md={3} key={brand}>
              <Card
                sx={{
                  position: 'relative',
                  height: 200,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
                onClick={() => navigate('/products')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://source.unsplash.com/random?${brand.toLowerCase()}-phone`}
                  alt={brand}
                  sx={{ filter: 'brightness(0.7)' }}
                />
                <CardContent
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    color: 'white',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  }}
                >
                  <Typography variant="h6">{brand}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box sx={{ backgroundColor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Stay Updated
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Subscribe to our newsletter to receive updates, news, and exclusive offers!
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/products')}
              endIcon={<ArrowForwardIcon />}
            >
              Subscribe Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 