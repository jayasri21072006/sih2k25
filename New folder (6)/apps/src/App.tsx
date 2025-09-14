import React, { useState } from 'react';
import Header from './components/Header';
import CommentInput from './components/CommentInput';
import SentimentAnalysis from './components/SentimentAnalysis';
import WordCloud from './components/WordCloud';
import OverallSummary from './components/OverallSummary';
import { analyzeSentiment } from './utils/sentimentAnalysis';
import { Loader, Play, Download, RefreshCw } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  source: 'manual' | 'file';
}

interface AnalyzedComment {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  summary: string;
  keywords: string[];
}

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [analyzedComments, setAnalyzedComments] = useState<AnalyzedComment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleCommentsChange = (newComments: Comment[]) => {
    setComments(newComments);
    if (newComments.length === 0) {
      setAnalyzedComments([]);
      setHasAnalyzed(false);
    }
  };

  const runAnalysis = async () => {
    if (comments.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const results = await analyzeSentiment(comments);
      setAnalyzedComments(results);
      setHasAnalyzed(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalyzedComments([]);
    setHasAnalyzed(false);
    setComments([]);
  };

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalComments: analyzedComments.length,
      sentimentDistribution: {
        positive: analyzedComments.filter(c => c.sentiment === 'positive').length,
        negative: analyzedComments.filter(c => c.sentiment === 'negative').length,
        neutral: analyzedComments.filter(c => c.sentiment === 'neutral').length,
      },
      comments: analyzedComments.map(comment => ({
        text: comment.text,
        sentiment: comment.sentiment,
        confidence: comment.confidence,
        summary: comment.summary,
        keywords: comment.keywords
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={runAnalysis}
                disabled={comments.length === 0 || isAnalyzing}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  comments.length === 0 || isAnalyzing
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
              
              <button
                onClick={resetAnalysis}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              
              {hasAnalyzed && (
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Results</span>
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {comments.length > 0 && (
                <span>{comments.length} comment{comments.length !== 1 ? 's' : ''} ready for analysis</span>
              )}
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Processing Comments
                    </p>
                    <p className="text-sm text-blue-700">
                      Running sentiment analysis, generating summaries, and extracting keywords...
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <CommentInput onCommentsChange={handleCommentsChange} />
            <WordCloud comments={analyzedComments} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <SentimentAnalysis comments={analyzedComments} />
            <OverallSummary comments={analyzedComments} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;