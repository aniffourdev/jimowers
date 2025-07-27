"use client";
import React, { useState } from "react";
import { IoArrowUndo } from "react-icons/io5";
import ReplyForm from "./ReplyForm";

interface Comment {
  id: number;
  author_name: string;
  author_email: string;
  content: {
    rendered: string;
  };
  date: string;
  parent: number;
  post: number;
  replies?: Comment[];
}

interface CommentsListProps {
  comments: Comment[];
  onReplyPosted?: (parentId: number, newReply: Comment) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, onReplyPosted }) => {
  const [showReplyForm, setShowReplyForm] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleReplyForm = (commentId: number) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500", 
      "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-red-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div 
      key={comment.id} 
      className={`mb-6 ${depth > 0 ? 'ml-8' : ''} ${depth === 0 ? 'border-b border-border pb-6' : ''}`}
    >
      <article className="flex gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {depth > 0 && (
            <div className="absolute -left-4 top-2 text-teal-500">
              <IoArrowUndo className="w-4 h-4" />
            </div>
          )}
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(comment.author_name)} flex items-center justify-center`}>
            <span className="text-white text-sm font-semibold">
              {comment.author_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground text-sm">
              {comment.author_name} <span className="text-muted-foreground font-normal">says:</span>
            </h4>
            <time 
              dateTime={comment.date} 
              className="text-muted-foreground text-xs"
            >
              {formatDate(comment.date)}
            </time>
          </div>
          
          <div 
            className="text-foreground text-sm leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />
          
          <button
            type="button"
            onClick={() => toggleReplyForm(comment.id)}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Reply
          </button>
        </div>
      </article>
      
      {showReplyForm[comment.id] && (
        <div className="mt-4 ml-14">
          <ReplyForm 
            parentId={comment.id} 
            postId={comment.post}
            parentAuthorName={comment.author_name}
            onReplyPosted={(newReply) => {
              if (onReplyPosted) {
                onReplyPosted(comment.id, newReply);
              }
            }}
            onCancel={() => toggleReplyForm(comment.id)}
          />
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (!comments.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <h3 className="font-bold text-3xl text-foreground mb-6">
        {comments.length} Response{comments.length !== 1 ? 's' : ''}
      </h3>
      <div className="border-t border-border pt-6">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentsList; 