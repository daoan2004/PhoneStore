import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearCart } from '../features/cart/cartSlice';

const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingForm()) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateShippingForm = () => {
    return Object.values(shippingData).every(value => value.trim() !== '');
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      // Here you would typically:
      // 1. Send order to your backend
      // 2. Process payment if not COD
      // 3. Clear cart and redirect to success page
      
      dispatch(clearCart());
      navigate('/order-success');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  const renderShippingForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="fullName"
          value={shippingData.fullName}
          onChange={handleShippingInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Address"
          name="address"
          value={shippingData.address}
          onChange={handleShippingInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingData.city}
          onChange={handleShippingInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Postal Code"
          name="postalCode"
          value={shippingData.postalCode}
          onChange={handleShippingInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={shippingData.phone}
          onChange={handleShippingInputChange}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentMethod = () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">Payment Method</FormLabel>
      <RadioGroup
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <FormControlLabel
          value="cod"
          control={<Radio />}
          label="Cash on Delivery"
        />
        <FormControlLabel
          value="card"
          control={<Radio />}
          label="Credit/Debit Card"
        />
        <FormControlLabel
          value="momo"
          control={<Radio />}
          label="MoMo"
        />
      </RadioGroup>
    </FormControl>
  );

  const renderOrderSummary = () => (
    <Box>
      <List>
        {items.map((item) => (
          <ListItem key={item._id}>
            <ListItemAvatar>
              <Avatar src={item.image} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body1">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Shipping Address:</Typography>
        <Typography>
          {shippingData.fullName}<br />
          {shippingData.address}<br />
          {shippingData.city}, {shippingData.postalCode}<br />
          Phone: {shippingData.phone}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6">Payment Method:</Typography>
        <Typography>
          {paymentMethod === 'cod' && 'Cash on Delivery'}
          {paymentMethod === 'card' && 'Credit/Debit Card'}
          {paymentMethod === 'momo' && 'MoMo'}
        </Typography>
      </Box>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderSummary();
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add some items before checkout.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage; 