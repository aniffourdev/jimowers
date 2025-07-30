import { NextRequest, NextResponse } from 'next/server';
import sanitize from 'dompurify';

export async function POST(req: NextRequest) {
  console.log("NEXT_PUBLIC_WORDPRESS_API_URL:", process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  try {
    const reqBody = await req.json();
    const { postId, rating, reviewText } = reqBody;

    // Validate input
    if (!postId || !rating) {
      return NextResponse.json({ message: 'Post ID and rating are required.' }, { status: 400 });
    }

    // Sanitize the review text
    const sanitizedReviewText = sanitize(reviewText);

    // Call the WordPress API to save the rating
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/custom/v1/save-rating`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          rating: rating,
          review_text: sanitizedReviewText,
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({ message: 'Rating saved successfully.' }, { status: 200 });
    } else {
      console.error('Failed to save rating to WordPress:', response.status);
      return NextResponse.json({ message: 'Failed to save rating to WordPress.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving rating to WordPress:', error);
    return NextResponse.json({ message: 'Error saving rating to WordPress.' }, { status: 500 });
  }
}
