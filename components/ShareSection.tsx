"use client";

import React, { useState, useEffect } from "react";
import { FaFacebookF, FaXTwitter, FaPinterestP } from "react-icons/fa6";

interface ShareSectionProps {
  title: string;
  slug: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({ title, slug }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      icon: FaFacebookF,
      color: "hover:bg-blue-600",
      background: "bg-blue-600",
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(title)}`,
      icon: FaXTwitter,
      color: "hover:bg-black",
      background: "bg-black",
    },
    {
      name: "Pinterest",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        currentUrl
      )}&description=${encodeURIComponent(title)}`,
      icon: FaPinterestP,
      color: "hover:bg-red-600",
      background: "bg-red-600",
    },
  ];

  return (
    <div className="text-center mt-16 my-10">
      <h3 className="font-bold text-lg text-foreground mb-4">Share</h3>
      <div className="flex justify-center gap-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-white transition-colors ${social.background} ${social.color} hover:text-white`}
            aria-label={`Share on ${social.name}`}
          >
            <social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShareSection;
