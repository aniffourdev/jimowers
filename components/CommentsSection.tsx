"use client";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

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

interface CommentsSectionProps {
  postId: number;
  initialComments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentPosted = (newComment: Comment) => {
    // Add the new comment to the beginning of the list
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const handleReplyPosted = (parentId: number, newReply: Comment) => {
    // Find the parent comment and add the reply to its replies array
    const updateCommentReplies = (commentList: Comment[]): Comment[] => {
      return commentList.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentReplies(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(prevComments => updateCommentReplies(prevComments));
  };

  return (
    <>
      <CommentsList 
        comments={comments} 
        onReplyPosted={handleReplyPosted}
      />
      <CommentForm 
        postId={postId} 
        onCommentPosted={handleCommentPosted}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default CommentsSection; 