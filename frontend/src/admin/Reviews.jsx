import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Star, User, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching reviews from API...');
      const response = await api.get('/reviews');
      console.log('📥 Reviews data:', response.data);
      setReviews(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      let errorMessage = 'Failed to load reviews.';
      if (error.response?.status === 404) {
        errorMessage = 'Reviews API not found. Please check backend.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check backend logs.';
      }
      setError(errorMessage);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#e6c364] animate-pulse text-lg font-medium">
          Loading reviews...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[#93000a]/20 border border-[#93000a]/30 rounded-2xl text-center max-w-2xl mx-auto mt-12">
        <AlertCircle className="mx-auto mb-4 text-[#ffb4ab]" size={48} />
        <p className="text-[#ffb4ab] text-lg">{error}</p>
        <button 
          onClick={fetchReviews}
          className="mt-6 px-6 py-3 bg-[#e6c364] text-[#1a1208] rounded-xl hover:bg-[#f5d77f] transition-all duration-300 font-semibold shadow-lg hover:shadow-[#e6c364]/30"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-xl font-bold bg-gradient-to-r from-[#f5d77f] to-[#e6c364] bg-clip-text text-transparent">
            Customer Reviews
          </h1>
          <p className="text-[#bfb5a4] mt-3 text-lg">
            See what customers think about your artifacts.
          </p>
        </div>

        <div className="bg-[#1d1712]/80 backdrop-blur-xl border border-[#e6c364]/20 rounded-2xl px-8 py-6 shadow-lg flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#e6c364]/10">
              <MessageSquare className="text-[#e6c364]" size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#f6f2ea]">
                {reviews.length}
              </p>
              <p className="text-sm text-[#9b917f]">Total Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="text-center py-32 bg-[#1d1712]/70 border border-[#4d4637]/40 rounded-3xl">
          <MessageSquare className="mx-auto text-[#4d4637]" size={72} />
          <h3 className="text-3xl mt-6 text-[#f2ece4] font-semibold">
            No Reviews Yet
          </h3>
          <p className="text-[#9b917f] mt-3 text-lg">
            Customer reviews will appear here once they start coming in.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review._id}
              className="group relative rounded-3xl border border-[#4d4637]/30 bg-gradient-to-br from-[#18120d] to-[#1d1712] backdrop-blur-lg p-8 transition-all duration-300 hover:border-[#e6c364]/50 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(230,195,100,0.12)]"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e6c364] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl" />

              {/* Top Section */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#e6c364] to-[#8f6f2d] flex items-center justify-center shadow-xl flex-shrink-0">
                    <User className="text-[#1a1208]" size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl text-[#f6f2ea] leading-tight">
                      {review.name || "Anonymous"}
                    </h3>
                    <div className="flex items-center gap-2 text-[#99907e] mt-1.5">
                      <Calendar size={15} />
                      <span className="text-sm">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#201912] px-5 py-3 rounded-xl border border-[#4d4637]/30 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < review.rating
                          ? "fill-[#e6c364] text-[#e6c364]"
                          : "text-[#5d5346]"
                      }
                    />
                  ))}
                  <span className="ml-2 text-[#f5d77f] font-bold text-lg">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Body */}
              <div className="mt-7 rounded-2xl bg-[#221b14]/60 border border-[#3d352a]/40 p-6 relative">
                <div className="absolute -top-3 left-6 text-[#e6c364] opacity-30 text-4xl leading-none">
                  "
                </div>
                <p className="leading-relaxed text-[#e8e1d9] text-base md:text-lg relative z-10 pl-4">
                  {review.body}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="px-5 py-2.5 rounded-full bg-[#e6c364]/10 text-[#f5d77f] border border-[#e6c364]/20 text-sm font-medium transition-all duration-200 hover:bg-[#e6c364]/20 hover:scale-105">
                  🌍 {review.region || 'Unknown Region'}
                </span>
                <span className="px-5 py-2.5 rounded-full bg-[#e6c364]/10 text-[#f5d77f] border border-[#e6c364]/20 text-sm font-medium transition-all duration-200 hover:bg-[#e6c364]/20 hover:scale-105">
                  🏺 {review.era || 'Unknown Era'}
                </span>
                <span className="px-5 py-2.5 rounded-full bg-[#e6c364]/10 text-[#f5d77f] border border-[#e6c364]/20 text-sm font-medium transition-all duration-200 hover:bg-[#e6c364]/20 hover:scale-105">
                  👍 {review.helpful || 0} Helpful
                </span>
              </div>

              {/* Divider */}
              <div className="mt-6 pt-6 border-t border-[#4d4637]/20 flex justify-between items-center">
                <span className="text-xs text-[#6b6253]">
                  Review ID: {review._id?.slice(-6) || 'N/A'}
                </span>
                <span className="text-xs text-[#6b6253]">
                  {review.createdAt && `Published ${formatDate(review.createdAt)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}