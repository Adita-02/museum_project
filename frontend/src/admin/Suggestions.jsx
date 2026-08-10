import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Lightbulb, User, Calendar, MessageSquare, AlertCircle, Sparkles, Mail, Globe, Clock } from 'lucide-react';

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📤 Fetching suggestions from API...');
      const response = await api.get('/suggestions');
      console.log('📥 Suggestions data:', response.data);
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
      let errorMessage = 'Failed to load suggestions.';
      if (error.response?.status === 404) {
        errorMessage = 'Suggestions API not found. Please check backend.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check backend logs.';
      }
      setError(errorMessage);
      setSuggestions([]);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'added':
        return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30';
      case 'reviewed':
        return 'bg-[#e6c364]/20 text-[#e6c364] border-[#e6c364]/30';
      default:
        return 'bg-[#4d4637]/20 text-[#99907e] border-[#4d4637]/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'added':
        return <Sparkles size={12} className="text-[#22c55e]" />;
      case 'reviewed':
        return <Lightbulb size={12} className="text-[#e6c364]" />;
      default:
        return <Clock size={12} className="text-[#99907e]" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[#e6c364]">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#e6c364] border-t-transparent" />
          <span className="text-lg font-medium">Loading suggestions...</span>
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
          onClick={fetchSuggestions}
          className="mt-6 px-6 py-3 bg-[#e6c364] text-[#1a1208] rounded-xl hover:bg-[#f5d77f] transition-all duration-300 font-semibold shadow-lg hover:shadow-[#e6c364]/30"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#e6c364]/10">
                <Lightbulb className="text-[#e6c364]" size={28} />
              </div>
              <h2 className="text-2xl md:text-xl font-bold bg-gradient-to-r from-[#f5d77f] to-[#e6c364] bg-clip-text text-transparent">
                Suggestions
              </h2>
            </div>
            <p className="text-[#bfb5a4] text-lg ml-12">
              User ideas and feedback for museum improvements.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#1d1712]/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-[#e6c364]/20 shadow-lg flex-shrink-0">
            <div className="p-2.5 rounded-xl bg-[#e6c364]/10">
              <MessageSquare className="text-[#e6c364]" size={22} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#f6f2ea]">{suggestions.length}</p>
              <p className="text-sm text-[#9b917f]">Total Suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length === 0 ? (
        <div className="text-center py-32 bg-[#1d1712]/70 border border-[#4d4637]/40 rounded-3xl">
          <Lightbulb className="mx-auto text-[#4d4637]" size={72} />
          <h3 className="text-3xl mt-6 text-[#f2ece4] font-semibold">
            No Suggestions Yet
          </h3>
          <p className="text-[#9b917f] mt-3 text-lg">
            User suggestions will appear here once they start coming in.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {suggestions.map((suggestion, index) => (
            <div 
              key={suggestion._id}
              className="group relative bg-gradient-to-br from-[#18120d] to-[#1d1712] border border-[#4d4637]/30 rounded-2xl p-7 transition-all duration-300 hover:border-[#e6c364]/50 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(230,195,100,0.08)]"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e6c364] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e6c364]/20 to-[#8f6f2d]/20 border border-[#e6c364]/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Lightbulb size={22} className="text-[#e6c364]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-3 mb-2">
                        <h3 className="font-semibold text-xl text-[#f6f2ea] leading-tight break-words">
                          {suggestion.topic || 'Untitled Suggestion'}
                        </h3>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(suggestion.status)} flex-shrink-0`}>
                          {getStatusIcon(suggestion.status)}
                          {suggestion.status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#99907e]">
                        <span className="flex items-center gap-1.5">
                          <User size={15} className="text-[#e6c364]" />
                          {suggestion.name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={15} className="text-[#e6c364]" />
                          {formatDate(suggestion.createdAt)}
                        </span>
                        {suggestion.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail size={15} className="text-[#e6c364]" />
                            <a href={`mailto:${suggestion.email}`} className="text-[#e6c364] hover:underline">
                              {suggestion.email}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {suggestion.description && (
                    <div className="mt-5 ml-16 rounded-xl bg-[#221b14]/60 border border-[#3d352a]/40 p-5">
                      <p className="text-[#e8e1d9] leading-relaxed text-base">
                        {suggestion.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 ml-16 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6c364]/10 border border-[#e6c364]/20">
                      <Globe size={15} className="text-[#e6c364]" />
                      <span className="text-sm text-[#f5d77f] font-medium">
                        {suggestion.page || 'europe'}
                      </span>
                    </div>
                    {suggestion.category && (
                      <div className="px-4 py-2 rounded-full bg-[#e6c364]/10 border border-[#e6c364]/20">
                        <span className="text-sm text-[#f5d77f] font-medium">
                          📂 {suggestion.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Divider */}
              <div className="mt-6 pt-5 border-t border-[#4d4637]/20 flex justify-between items-center">
                <span className="text-xs text-[#6b6253]">
                  ID: {suggestion._id?.slice(-8) || 'N/A'}
                </span>
                <span className="text-xs text-[#6b6253]">
                  {suggestion.createdAt && `Submitted ${formatDate(suggestion.createdAt)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}