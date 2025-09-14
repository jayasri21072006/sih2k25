// Simulated sentiment analysis - In production, this would connect to actual AI services
// like OpenAI GPT, Hugging Face, or custom ML models

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

// Simulated sentiment words for demo purposes
const positiveWords = [
  'good', 'excellent', 'great', 'positive', 'support', 'approve', 'beneficial', 
  'effective', 'improvement', 'strengthen', 'enhance', 'valuable', 'important',
  'necessary', 'recommend', 'agree', 'constructive', 'helpful', 'meaningful'
];

const negativeWords = [
  'bad', 'poor', 'negative', 'oppose', 'disagree', 'harmful', 'ineffective',
  'problematic', 'concerning', 'inadequate', 'insufficient', 'unfair', 'reject',
  'against', 'inappropriate', 'flawed', 'unreasonable', 'unacceptable'
];

const neutralWords = [
  'consider', 'suggest', 'clarify', 'modify', 'adjust', 'review', 'examine',
  'evaluate', 'analyze', 'assess', 'alternative', 'proposal', 'recommendation'
];

export const analyzeSentiment = (comments: Comment[]): Promise<AnalyzedComment[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const analyzedComments: AnalyzedComment[] = comments.map(comment => {
        const text = comment.text.toLowerCase();
        const words = text.split(/\W+/).filter(word => word.length > 2);
        
        // Simple sentiment scoring
        let positiveScore = 0;
        let negativeScore = 0;
        let neutralScore = 0;
        
        words.forEach(word => {
          if (positiveWords.some(pw => word.includes(pw) || pw.includes(word))) {
            positiveScore++;
          }
          if (negativeWords.some(nw => word.includes(nw) || nw.includes(word))) {
            negativeScore++;
          }
          if (neutralWords.some(neut => word.includes(neut) || neut.includes(word))) {
            neutralScore++;
          }
        });
        
        // Determine sentiment
        let sentiment: 'positive' | 'negative' | 'neutral';
        let confidence: number;
        
        if (positiveScore > negativeScore && positiveScore > neutralScore) {
          sentiment = 'positive';
          confidence = Math.min(0.95, 0.6 + (positiveScore / words.length));
        } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
          sentiment = 'negative';
          confidence = Math.min(0.95, 0.6 + (negativeScore / words.length));
        } else {
          sentiment = 'neutral';
          confidence = Math.min(0.95, 0.5 + Math.random() * 0.3);
        }
        
        // Generate summary (simplified)
        const summary = generateSummary(comment.text, sentiment);
        
        // Extract keywords
        const keywords = extractKeywords(comment.text);
        
        return {
          id: comment.id,
          text: comment.text,
          sentiment,
          confidence,
          summary,
          keywords
        };
      });
      
      resolve(analyzedComments);
    }, 1500); // Simulate API delay
  });
};

const generateSummary = (text: string, sentiment: 'positive' | 'negative' | 'neutral'): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim();
  
  if (!firstSentence) return text.substring(0, 100) + '...';
  
  const summaryPrefix = {
    positive: 'Stakeholder expresses support:',
    negative: 'Stakeholder raises concerns:',
    neutral: 'Stakeholder suggests:'
  };
  
  return `${summaryPrefix[sentiment]} ${firstSentence.substring(0, 80)}${firstSentence.length > 80 ? '...' : ''}`;
};

const extractKeywords = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 
    'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 
    'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !commonWords.has(word) &&
      !/^\d+$/.test(word)
    );
    
  // Get unique words and limit to top 5 by frequency
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
};