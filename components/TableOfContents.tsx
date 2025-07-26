"use client";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";

export type TocItem = { text: string; id: string; level: number };

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleToc = () => setIsOpen((v) => !v);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav
      className="bg-slate-100 p-5 mb-8 rounded"
      aria-label="Table of Contents"
    >
      <button
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={toggleToc}
        aria-expanded={isOpen}
        aria-controls="toc-content"
      >
        <h2 className="font-semibold text-lg text-black uppercase mb-0">
          See What&apos;s Inside
        </h2>
        {isOpen ? (
          <FaMinus className="text-black" />
        ) : (
          <FaPlus className="text-black" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{ open: { height: "auto" }, closed: { height: 0 } }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
        id="toc-content"
      >
        {isOpen && (
          <div className="mt-4 space-y-2">
            <ul>
              {toc.map((item) => (
                <li
                  key={item.id}
                  className={`pb-2 ${item.level === 3 ? "ml-4" : ""}`}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="toc-link text-slate-700 font-semibold text-[13px] transition-all hover:text-slate-950"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </nav>
  );
}
