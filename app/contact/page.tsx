import { Section, Container } from "@/components/craft";
import ContactForm from "@/components/ContactForm";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaLeaf } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-teal-100 to-emerald-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"></div>
        
        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-6">
              <FaLeaf className="text-teal-600 dark:text-teal-400 text-2xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Let's Grow Together
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Have questions about lawn care? Need expert advice on choosing the perfect mower? 
              <br className="hidden sm:block" />
              We're here to help you create the lawn of your dreams.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Expert Advice
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Quick Response
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Expert Reviews
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section className="py-16 sm:py-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ready to transform your lawn? Our team of lawn care experts is here to guide you every step of the way.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="group p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-border hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                      <FaEnvelope className="text-teal-600 dark:text-teal-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
                      <p className="text-muted-foreground mb-2">We'll respond within 24 hours</p>
                      <a href="mailto:aniffour.dev@gmail.com" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                        aniffour.dev@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-border hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                      <FaPhone className="text-teal-600 dark:text-teal-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Call Us</h4>
                      <p className="text-muted-foreground mb-2">Mon-Fri, 9AM-6PM EST</p>
                      <a href="tel:+15551234567" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-white dark:bg-zinc-800 rounded-2xl border border-border hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                      <FaMapMarkerAlt className="text-teal-600 dark:text-teal-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Visit Us</h4>
                      <p className="text-muted-foreground mb-2">Our headquarters</p>
                      <address className="text-teal-600 dark:text-teal-400 font-medium not-italic">
                        123 Lawn Care Street<br />
                        Garden City, GC 12345
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-muted-foreground">15+ years of lawn care expertise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-muted-foreground">Eco-friendly solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-muted-foreground">Personalized recommendations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-border p-8 sm:p-10 shadow-xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3 text-foreground">
                    Send us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Tell us about your lawn care needs and we'll get back to you with personalized advice.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
} 