import React, { useMemo } from 'react';
import { Cloud } from 'lucide-react';

interface WordCloudProps {
  comments: Array<{ keywords: string[]; text: string }>;
}

const WordCloud: React.FC<WordCloudProps> = ({ comments }) => {
  const wordFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    
    comments.forEach(comment => {
      // Extract words from keywords
      comment.keywords.forEach(keyword => {
        freq[keyword.toLowerCase()] = (freq[keyword.toLowerCase()] || 0) + 1;
      });
      
      // Also extract common words from text
      const words = comment.text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => 
          word.length > 3 && 
          !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'].includes(word)
        );
      
      words.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
      });
    });
    
    return freq;
  }, [comments]);

  const sortedWords = useMemo(() => {
    return Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50); // Top 50 words
  }, [wordFrequency]);

  const maxFreq = Math.max(...sortedWords.map(([, freq]) => freq));

  const getWordSize = (frequency: number) => {
    const minSize = 12;
    const maxSize = 32;
    const ratio = frequency / maxFreq;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getWordColor = (frequency: number) => {
    const colors = [
      'text-blue-600',
      'text-green-600',
      'text-purple-600',
      'text-red-600',
      'text-indigo-600',
      'text-pink-600',
      'text-yellow-600',
      'text-teal-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>Word Cloud</span>
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Word cloud will appear here once comments are analyzed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <Cloud className="h-5 w-5" />
        <span>Keyword Word Cloud</span>
      </h2>
      
      <div className="bg-gray-50 rounded-lg p-8 min-h-[300px] flex flex-wrap items-center justify-center gap-2">
        {sortedWords.map(([word, frequency], index) => (
          <span
            key={word}
            className={`font-medium hover:opacity-70 transition-opacity cursor-pointer ${getWordColor(frequency)}`}
            style={{
              fontSize: `${getWordSize(frequency)}px`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              display: 'inline-block',
              margin: '2px 4px'
            }}
            title={`"${word}" appears ${frequency} times`}
          >
            {word}
          </span>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing top {sortedWords.length} keywords from {comments.length} comments
        </p>
        <div className="flex justify-center items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span className="text-xs text-gray-500">Low frequency</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-xs text-gray-500">Medium frequency</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-blue-600 rounded"></div>
            <span className="text-xs text-gray-500">High frequency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;