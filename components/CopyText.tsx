"use client"

import { useState, CSSProperties } from "react"
import { Copy, Check } from "lucide-react"

interface CopyTextProps {
  /** The text to copy */
  text: string
  /** Optional tooltip position (default: top) */
  tooltipPosition?: "top" | "bottom"
  /** Optional custom className for outer container */
  className?: string
  /** Optional inline style overrides for outer container */
  style?: CSSProperties
  /** Optional custom className for text span */
  textClassName?: string
  /** Optional inline style overrides for text span */
  textStyle?: CSSProperties
}

export default function CopyText({
  text = "",
  tooltipPosition = "top",
  className = "",
  style = {},
  textClassName = "",
  textStyle = {},
}: CopyTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className={`relative inline-flex items-center gap-2 rounded-lg px-3 py-2 ${className}`}
      style={style}
    >
      <span
        className={`font-mono select-all ${textClassName}`}
        style={textStyle}
      >
        {text}
      </span>

      <button
        onClick={handleCopy}
        className="p-2 rounded-md hover:bg-gray-200 transition-colors relative"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-blue-600" />
        )}

        {/* Tooltip */}
        <span
          className={`absolute ${
            tooltipPosition === "top"
              ? "-top-8 left-1/2 -translate-x-1/2"
              : "top-8 left-1/2 -translate-x-1/2"
          } px-2 py-1 text-xs text-white rounded-md transition-all duration-200 ${
            copied ? "opacity-100 scale-100 bg-green-600" : "opacity-0 scale-95 bg-gray-800"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    </div>
  )
}
