"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

interface CommentFormProps {
  postId: number;
  onCommentPosted?: (comment: Comment) => void;
}

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
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentPosted }) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { author: string; email: string; content: string }) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postId,
          author_name: values.author,
          author_email: values.email,
          content: values.content,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        toast.success("Comment posted successfully!");
        if (onCommentPosted) {
          onCommentPosted(comment);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to post comment.");
      }
    } catch (err) {
      toast.error("Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    author: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    content: Yup.string().required("Comment is required"),
  });

  return (
    <div className="mt-12">
      <h3 className="font-bold text-3xl text-foreground mb-4">
        Leave a Reply
      </h3>
      
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        You&#39;re very welcome to leave a comment or question. Please know that all comments must meet our community guidelines, and your email address will NOT be published. Let&#39;s have a positive and constructive conversation.
      </p>
      
      <Formik
        initialValues={{ author: "", email: "", content: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Comment *
              </label>
              <Field
                as="textarea"
                name="content"
                id="content"
                rows={8}
                className="w-full border border-border bg-background text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                placeholder="Comment *"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name *
                </label>
                <Field
                  type="text"
                  name="author"
                  id="author"
                  className="w-full border border-border bg-background text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Name *"
                />
                <ErrorMessage name="author" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email *
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border border-border bg-background text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Email *"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CommentForm; 