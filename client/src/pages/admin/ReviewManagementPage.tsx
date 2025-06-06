import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Rating,
  Chip,
  Avatar,
  Grid,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Flag as FlagIcon,
  CheckCircle as ApproveIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getReviews,
  updateReviewStatus,
  deleteReview,
} from '../../features/reviews/reviewSlice';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    image: string;
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  isReported: boolean;
  reportReason?: string;
}

const ReviewManagementPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.reviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReview(reviewId));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleUpdateStatus = async (reviewId: string, status: Review['status']) => {
    try {
      await dispatch(updateReviewStatus({ reviewId, status }));
      if (selectedReview?._id === reviewId) {
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const getStatusColor = (status: Review['status']) => {
    const statusColors = {
      pending: theme.palette.warning.main,
      approved: theme.palette.success.main,
      rejected: theme.palette.error.main,
    };
    return statusColors[status];
  };

  const filteredReviews = reviews
    .filter((review) => {
      const searchMatch =
        review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || review.status === statusFilter;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Review Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search reviews"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Reviews</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Reviews Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow
                key={review._id}
                sx={review.isReported ? { backgroundColor: 'error.light' } : {}}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={review.product.image}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography>{review.product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{review.user.name}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  <Typography noWrap sx={{ maxWidth: 200 }}>
                    {review.comment}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      sx={{
                        backgroundColor: `${getStatusColor(review.status)}15`,
                        color: getStatusColor(review.status),
                        fontWeight: 500,
                      }}
                    />
                    {review.isReported && (
                      <Chip
                        icon={<FlagIcon />}
                        label="Reported"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewReview(review)}
                    sx={{ mr: 1 }}
                  >
                    <ViewIcon />
                  </IconButton>
                  {review.status === 'pending' && (
                    <IconButton
                      color="success"
                      onClick={() => handleUpdateStatus(review._id, 'approved')}
                      sx={{ mr: 1 }}
                    >
                      <ApproveIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedReview && (
          <>
            <DialogTitle>Review Details</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      src={selectedReview.product.image}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box>
                      <Typography variant="h6">{selectedReview.product.name}</Typography>
                      <Typography color="text.secondary">
                        Product ID: {selectedReview.product._id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Customer Information
                  </Typography>
                  <Typography>Name: {selectedReview.user.name}</Typography>
                  <Typography>Email: {selectedReview.user.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Review Details
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Rating:</Typography>
                    <Rating value={selectedReview.rating} readOnly />
                  </Box>
                  <Typography>
                    Date: {new Date(selectedReview.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Comment
                  </Typography>
                  <Typography>{selectedReview.comment}</Typography>
                </Grid>

                {selectedReview.isReported && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Report Information
                    </Typography>
                    <Typography color="error">
                      Reason: {selectedReview.reportReason}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <TextField
                      select
                      value={selectedReview.status}
                      onChange={(e) =>
                        handleUpdateStatus(selectedReview._id, e.target.value as Review['status'])
                      }
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button
                onClick={() => handleDeleteReview(selectedReview._id)}
                color="error"
                variant="contained"
              >
                Delete Review
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ReviewManagementPage; 