import React from 'react';
import { FileText, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface AnalyzedComment {
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  keywords: string[];
}

interface OverallSummaryProps {
  comments: AnalyzedComment[];
}

const OverallSummary: React.FC<OverallSummaryProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Overall Analysis Summary</span>
        </h2>
        <p className="text-gray-500">Summary will be generated after analyzing comments.</p>
      </div>
    );
  }

  const positiveComments = comments.filter(c => c.sentiment === 'positive');
  const negativeComments = comments.filter(c => c.sentiment === 'negative');
  const neutralComments = comments.filter(c => c.sentiment === 'neutral');

  const generateOverallSummary = () => {
    const totalComments = comments.length;
    const positivePercent = ((positiveComments.length / totalComments) * 100).toFixed(1);
    const negativePercent = ((negativeComments.length / totalComments) * 100).toFixed(1);
    const neutralPercent = ((neutralComments.length / totalComments) * 100).toFixed(1);

    let overallSentiment = 'mixed';
    if (positiveComments.length > negativeComments.length && positiveComments.length > neutralComments.length) {
      overallSentiment = 'generally positive';
    } else if (negativeComments.length > positiveComments.length && negativeComments.length > neutralComments.length) {
      overallSentiment = 'generally negative';
    } else {
      overallSentiment = 'balanced';
    }

    return {
      overallSentiment,
      totalComments,
      positivePercent,
      negativePercent,
      neutralPercent
    };
  };

  const getTopConcerns = () => {
    const negativeKeywords = negativeComments.flatMap(c => c.keywords);
    const keywordFreq: Record<string, number> = {};
    negativeKeywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });
    return Object.entries(keywordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([keyword]) => keyword);
  };

  const getPositiveHighlights = () => {
    const positiveKeywords = positiveComments.flatMap(c => c.keywords);
    const keywordFreq: Record<string, number> = {};
    positiveKeywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });
    return Object.entries(keywordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([keyword]) => keyword);
  };

  const summary = generateOverallSummary();
  const topConcerns = getTopConcerns();
  const positiveHighlights = getPositiveHighlights();

  const getRecommendations = () => {
    const recommendations = [];
    
    if (negativeComments.length > positiveComments.length) {
      recommendations.push("Address key concerns raised by stakeholders, particularly those mentioned frequently in negative feedback.");
    }
    
    if (positiveComments.length > 0) {
      recommendations.push("Build upon aspects that received positive feedback to strengthen the draft legislation.");
    }
    
    if (neutralComments.length > comments.length * 0.4) {
      recommendations.push("Engage with stakeholders providing neutral feedback to better understand their positions.");
    }

    recommendations.push("Consider conducting follow-up consultations on contentious issues identified through sentiment analysis.");
    
    return recommendations;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <FileText className="h-5 w-5" />
        <span>Overall Analysis Summary</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Statistics */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Consultation Overview</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Total Comments:</strong> {summary.totalComments}</p>
              <p><strong>Overall Sentiment:</strong> 
                <span className={`ml-1 font-medium ${
                  summary.overallSentiment.includes('positive') ? 'text-green-600' :
                  summary.overallSentiment.includes('negative') ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {summary.overallSentiment}
                </span>
              </p>
              <div className="pt-2">
                <p><strong>Sentiment Distribution:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Positive: {summary.positivePercent}%</li>
                  <li>• Negative: {summary.negativePercent}%</li>
                  <li>• Neutral: {summary.neutralPercent}%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Positive Highlights */}
          {positiveHighlights.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Positive Themes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {positiveHighlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Concerns and Recommendations */}
        <div className="space-y-4">
          {/* Top Concerns */}
          {topConcerns.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Key Concerns</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topConcerns.map((concern, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {getRecommendations().map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Executive Summary</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          The eConsultation received {summary.totalComments} stakeholder responses with a {summary.overallSentiment} reception. 
          {positiveComments.length > 0 && ` ${summary.positivePercent}% of responses were positive, highlighting support for key aspects of the draft legislation.`}
          {negativeComments.length > 0 && ` ${summary.negativePercent}% expressed concerns that should be carefully considered for potential amendments.`}
          {neutralComments.length > 0 && ` ${summary.neutralPercent}% provided neutral feedback with constructive suggestions.`}
          {' '}This analysis provides a foundation for informed decision-making in the legislative amendment process.
        </p>
      </div>
    </div>
  );
};

export default OverallSummary;