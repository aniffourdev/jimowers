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
      background: "bg-[#3b5998]",
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(title)}`,
      icon: FaXTwitter,
      background: "bg-black",
    },
    {
      name: "Pinterest",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        currentUrl
      )}&description=${encodeURIComponent(title)}`,
      icon: FaPinterestP,
      background: "bg-[#bd081c]",
    },
  ];

  return (
    <div className="text-center mt-16 my-10">
      <h3 className="font-bold text-lg text-foreground mb-3">Share</h3>
      <div className="flex justify-center gap-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${social.background}`}
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
