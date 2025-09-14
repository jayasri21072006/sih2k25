import React, { useState } from 'react';
import { Upload, FileText, Plus, X } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  source: 'manual' | 'file';
}

interface CommentInputProps {
  onCommentsChange: (comments: Comment[]) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onCommentsChange }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        source: 'manual'
      };
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      onCommentsChange(updatedComments);
      setNewComment('');
    }
  };

  const removeComment = (id: string) => {
    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    onCommentsChange(updatedComments);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        const newComments: Comment[] = lines.map((line, index) => ({
          id: `${Date.now()}-${index}`,
          text: line.trim(),
          source: 'file'
        }));
        const updatedComments = [...comments, ...newComments];
        setComments(updatedComments);
        onCommentsChange(updatedComments);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.files = e.dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Input Comments for Analysis
      </h2>
      
      <div className="space-y-4">
        {/* Manual Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Individual Comment
          </label>
          <div className="flex space-x-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter stakeholder comment or suggestion..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={addComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Comments File
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop a text file, or click to browse
            </p>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>

        {/* Comments List */}
        {comments.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Comments Queue ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{comment.text}</p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      comment.source === 'manual' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {comment.source === 'manual' ? 'Manual Entry' : 'File Upload'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeComment(comment.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentInput;