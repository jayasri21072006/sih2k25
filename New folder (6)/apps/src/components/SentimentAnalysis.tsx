import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface AnalyzedComment {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  summary: string;
  keywords: string[];
}

interface SentimentAnalysisProps {
  comments: AnalyzedComment[];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sentiment Analysis Results
        </h2>
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No comments to analyze. Please add comments above.</p>
        </div>
      </div>
    );
  }

  const sentimentCounts = comments.reduce((acc, comment) => {
    acc[comment.sentiment]++;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Sentiment Analysis Results
      </h2>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Positive</p>
              <p className="text-2xl font-bold text-green-800">
                {sentimentCounts.positive}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(sentimentCounts.positive / comments.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Negative</p>
              <p className="text-2xl font-bold text-red-800">
                {sentimentCounts.negative}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-red-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${(sentimentCounts.negative / comments.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Neutral</p>
              <p className="text-2xl font-bold text-gray-800">
                {sentimentCounts.neutral}
              </p>
            </div>
            <Minus className="h-8 w-8 text-gray-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full"
                style={{
                  width: `${(sentimentCounts.neutral / comments.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Individual Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Individual Comment Analysis
        </h3>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-2">{comment.text}</p>
                <p className="text-sm text-blue-600 italic">{comment.summary}</p>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <span
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                    comment.sentiment
                  )}`}
                >
                  {getSentimentIcon(comment.sentiment)}
                  <span className="capitalize">{comment.sentiment}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {(comment.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
            </div>
            
            {comment.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                {comment.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentAnalysis;