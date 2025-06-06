import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { reportReview } from '../features/reviews/reviewSlice';
import { Review } from '../features/reviews/reviewSlice';

interface ReviewListProps {
  productId: string;
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, reviews }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, review: Review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleReportClick = () => {
    handleMenuClose();
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    if (selectedReview && reportReason.trim()) {
      try {
        await dispatch(
          reportReview({ reviewId: selectedReview._id, reason: reportReason })
        ).unwrap();
        setReportDialogOpen(false);
        setReportReason('');
      } catch (error) {
        console.error('Failed to report review:', error);
      }
    }
  };

  const approvedReviews = reviews.filter((review) => review.status === 'approved');

  if (approvedReviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="text.secondary">
          No reviews yet. Be the first to review this product!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {approvedReviews.map((review, index) => (
        <Box key={review._id}>
          {index > 0 && <Divider sx={{ my: 2 }} />}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {review.user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {review.user.name}
                </Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
            </Box>
            {user && user._id !== review.user._id && (
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, review)}
                aria-label="review options"
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{ mt: 1, ml: 7, color: 'text.secondary' }}
          >
            {review.comment}
          </Typography>

          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 1, ml: 7, color: 'text.secondary' }}
          >
            {new Date(review.createdAt).toLocaleDateString()}
          </Typography>

          {review.isReported && user?.role === 'admin' && (
            <Box
              sx={{
                mt: 1,
                ml: 7,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'error.main',
              }}
            >
              <FlagIcon fontSize="small" />
              <Typography variant="caption" color="error">
                Reported: {review.reportReason}
              </Typography>
            </Box>
          )}
        </Box>
      ))}

      {/* Review Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReportClick}>
          <FlagIcon fontSize="small" sx={{ mr: 1 }} />
          Report Review
        </MenuItem>
      </Menu>

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for reporting"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please explain why you're reporting this review..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReportSubmit}
            color="primary"
            variant="contained"
            disabled={!reportReason.trim()}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewList; 