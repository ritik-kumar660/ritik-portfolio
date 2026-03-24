import { useState } from 'react'
import { personalData } from '../data/data'
import { Download, ExternalLink, FileText } from 'lucide-react'

export default function Resume() {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <section id="resume" className="py-24 bg-[#080810] text-white">

      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">My Resume</h2>
          <p className="text-gray-400 mt-2">
            View or download my professional resume
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-10">

          {/* 🔥 PREVIEW BUTTON */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            {showPreview ? "Hide Preview" : "Preview Resume"}
          </button>

          {/* 🔥 OPEN FULL */}
          <a
            href={personalData.resume}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full
          </a>

          {/* 🔥 DOWNLOAD */}
          <a
            href={personalData.resume}
            download="Ritik_Kumar_Resume.pdf"
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </a>

        </div>

        {/* 🔥 PDF PREVIEW */}
        {showPreview && (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fadeIn">

            {/* Glow */}
            <div className="absolute inset-0 bg-red-500/5 blur-2xl pointer-events-none"></div>

            {/* IFRAME */}
            <iframe
              src={personalData.resume}
              className="w-full h-[600px] bg-white rounded-2xl"
              title="Resume Preview"
            />

          </div>
        )}

      </div>
    </section>
  )
}