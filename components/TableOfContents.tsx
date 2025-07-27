"use client";
import { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaFacebook,
  FaPinterest,
  FaWhatsapp,
  FaTwitter,
  FaReddit,
  FaLink,
} from "react-icons/fa";
import { motion } from "framer-motion";

export type TocItem = { text: string; id: string; level: number };

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");
  
  const toggleToc = () => setIsOpen((v) => !v);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set share URL and title after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(encodeURIComponent(window.location.href));
      setShareTitle(encodeURIComponent(document.title));
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: FaFacebook,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`,
      icon: FaPinterest,
      color: 'hover:bg-red-600'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      icon: FaWhatsapp,
      color: 'hover:bg-green-600'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      icon: FaTwitter,
      color: 'hover:bg-sky-500'
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${shareUrl}&title=${shareTitle}`,
      icon: FaReddit,
      color: 'hover:bg-orange-600'
    }
  ];

  return (
    <div className="bg-muted/60 dark:bg-muted/80 border border-border rounded-xl shadow-sm p-6 mb-8 w-full transition-colors">
      {/* Share Section */}
      <div className="mb-6 pb-4 border-b border-border">
        <h3 className="font-semibold text-lg text-foreground mb-3 flex justify-start items-center gap-1"><span className="text-red-600 text-2xl relative top-[1px]">❤</span> Spread the love</h3>
        <div className="flex flex-wrap gap-2">
          {shareLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg bg-background border border-border text-muted-foreground transition-colors ${social.color} hover:text-white`}
              aria-label={`Share on ${social.name}`}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded-lg bg-background border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-white ${copied ? 'bg-green-600 text-white' : ''}`}
            aria-label="Copy link"
          >
            <FaLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <nav aria-label="Table of Contents">
        <button
          className="flex items-center w-full cursor-pointer select-none group"
          onClick={toggleToc}
          aria-expanded={isOpen}
          aria-controls="toc-content"
          tabIndex={0}
        >
          <h2 className="font-semibold text-xl text-foreground mb-0 flex-1 text-left tracking-tight">
            Table of Contents
          </h2>
          <span className={`ml-2 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`}>
            <FaChevronDown className="text-muted-foreground" />
          </span>
        </button>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={{ open: { height: "auto", opacity: 1 }, closed: { height: 0, opacity: 0 } }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
          id="toc-content"
        >
          {isOpen && (
            <ul className="mt-4 space-y-1">
              {toc.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center group pb-2 ${item.level === 3 ? 'pl-5' : ''}`}
                >
                  <span className="mr-3 mt-0.5 flex-shrink-0 w-2 h-2 rounded-full bg-muted-foreground/40" />
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="toc-link text-muted-foreground hover:text-primary font-medium text-[15px] transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </nav>
    </div>
  );
}
