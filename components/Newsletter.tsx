"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface FormValues {
  email: string;
}

const Newsletter = () => {
  const acceptedDomains = ["gmail.com", "hotmail.com", "outlook.com", "icloud.com", "mail.com"];

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test("accepted-domains", "Email domain not accepted", (value) => {
        if (value) {
          const domain = value.split("@")[1];
          return acceptedDomains.includes(domain);
        }
        return true;
      })
      .test("spam-check", "", (value) => {
        if (value) {
          const randomSpamCheck = Math.random();
          return randomSpamCheck >= 0.3;
        }
        return true;
      }),
  });

  const initialValues: FormValues = {
    email: "",
  };

  const handleSubmit = (values: FormValues, { setSubmitting, setFieldError }: FormikHelpers<FormValues>) => {
    setSubmitting(true);

    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Thank you for subscribing!");
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Something went wrong");
          });
        }
      })
      .catch((error) => {
        setFieldError("email", error.message);
        console.log(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="max-w-xl mx-auto bg-teal-50 shadow-sm dark:bg-zinc-800 rounded-lg p-4 sm:p-12 text-center">
        <h3 className="text-base sm:text-3xl text-teal-600 font-bold mb-2 sm:mb-3">
          Keep in Touch!
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
          Subscribe to get expert tips, guides, and our exclusive checklist
          delivered to your inbox.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col sm:flex-row gap-2 justify-center">
              <Field
                as={Input}
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="flex-1 text-sm sm:text-base"
              />
              <ErrorMessage 
                name="email" 
                component="div" 
                className="text-red-500 text-xs mt-1" 
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 rounded bg-teal-700 text-white font-semibold hover:bg-teal-800 transition text-sm sm:text-base disabled:opacity-50"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </Form>
          )}
        </Formik>
        <Toaster position="top-right" reverseOrder={true} />
      </div>
    </>
  );
};

export default Newsletter; 