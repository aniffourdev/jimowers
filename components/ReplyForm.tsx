"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

interface ReplyFormProps {
  parentId: number;
  postId: number;
  parentAuthorName: string;
  onReplyPosted: (newReply: Comment) => void;
  onCancel: () => void;
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

const ReplyForm: React.FC<ReplyFormProps> = ({ parentId, postId, parentAuthorName, onReplyPosted, onCancel }) => {
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
          parent: parentId,
          author_name: values.author,
          author_email: values.email,
          content: values.content,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        toast.success("Reply posted successfully!");
        if (onReplyPosted) {
          onReplyPosted(comment);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to post reply.");
      }
    } catch (err) {
      toast.error("Failed to post reply.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    author: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    content: Yup.string().required("Reply is required"),
  });

  return (
    <div className="bg-muted/20 dark:bg-muted/30 border border-border rounded p-4">
      <div className="flex items-center justify-start gap-1.5 mb-3">
        <h4 className="font-medium text-foreground text-sm">
          Reply to {parentAuthorName}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground text-teal-500 hover:text-foreground text-xs font-semibold transition-colors"
        >
          Cancel Reply
        </button>
      </div>
      
      <Formik
        initialValues={{ author: "", email: "", content: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="mb-3">
              <label
                htmlFor={`content-${parentId}`}
                className="block text-xs font-medium text-foreground mb-1"
              >
                Reply *
              </label>
              <Field
                as="textarea"
                name="content"
                id={`content-${parentId}`}
                rows={4}
                className="w-full border border-border bg-background text-foreground rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                placeholder="Write your reply..."
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <div>
                <label
                  htmlFor={`author-${parentId}`}
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  Name *
                </label>
                <Field
                  type="text"
                  name="author"
                  id={`author-${parentId}`}
                  className="w-full border border-border bg-background text-foreground rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Your name"
                />
                <ErrorMessage name="author" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label
                  htmlFor={`email-${parentId}`}
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  Email *
                </label>
                <Field
                  type="email"
                  name="email"
                  id={`email-${parentId}`}
                  className="w-full border border-border bg-background text-foreground rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Reply"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReplyForm; 