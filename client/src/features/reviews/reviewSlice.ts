import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Review {
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

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// Async thunks
export const getReviews = createAsyncThunk(
  'reviews/getReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reviews');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (
    { productId, rating, comment }: { productId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/reviews', { productId, rating, comment });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  'reviews/updateStatus',
  async (
    { reviewId, status }: { reviewId: string; status: Review['status'] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(`/api/reviews/${reviewId}/status`, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review status');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const reportReview = createAsyncThunk(
  'reviews/reportReview',
  async (
    { reviewId, reason }: { reviewId: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/reviews/${reviewId}/report`, { reason });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Review Status
      .addCase(updateReviewStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex((review) => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reviews = state.reviews.filter((review) => review._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Report Review
      .addCase(reportReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex((review) => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(reportReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer; 