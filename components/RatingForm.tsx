"use client";

import React, { useState } from 'react';

interface RatingFormProps {
  postId: number;
}

const RatingForm: React.FC<RatingFormProps> = ({ postId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [showReviewTextarea, setShowReviewTextarea] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    setShowReviewTextarea(true);
  };

  const handleReviewSubmit = async () => {
     // Basic validation
     if (!reviewText.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    if (rating === null) {
      alert("Please provide a rating!");
      return;
    }

    try {
      const response = await fetch('/api/submit-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          rating: rating,
          reviewText: reviewText,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        alert('Thanks for your review!');
      } else {
        console.error('Failed to submit rating:', response.status);
        alert('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    }
  };

  if (submitted) {
    return <p>Thank you for submitting your review!</p>;
  }

  return (
    <div>
      <p>How useful was this post?</p>
      <p>Click on a star to rate (you can leave written feedback after clicking submit)</p>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (rating || 0) ? 'active' : ''}`}
            onClick={() => handleStarClick(star)}
            style={{cursor: 'pointer', color: star <= (rating || 0) ? 'gold' : 'gray', fontSize: '24px'}}
          >
            &#9733;
          </span>
        ))}
      </div>
      {!showReviewTextarea && (
        <button onClick={handleSubmit}>Submit Rating</button>
      )}
      {showReviewTextarea && (
        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            style={{width: '100%', marginBottom: '10px'}}
          />
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default RatingForm;