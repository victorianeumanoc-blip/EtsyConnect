import { useCallback, useState } from 'react'
import { Upload, File, X, CheckCircle, Image as ImageIcon } from 'lucide-react'

export function FileUploader({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true)
        } else if (e.type === 'dragleave') {
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(Array.from(e.dataTransfer.files))
        }
    }, [onUpload])

    const handleChange = useCallback((e) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(Array.from(e.target.files))
        }
    }, [onUpload])

    return (
        <div
            className={`relative group cursor-pointer transition-all duration-500 overflow-hidden
        p-12 border border-dashed rounded-3xl text-center
        ${isDragging
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
                }
      `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
        >
            <input
                id="file-input"
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleChange}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center pointer-events-none">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500
          ${isDragging
                        ? 'bg-indigo-500 text-white scale-110 rotate-3 shadow-lg'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-slate-400 group-hover:border-indigo-500/50 group-hover:text-indigo-400 group-hover:scale-105 group-hover:-rotate-3 shadow-xl'
                    }
        `}>
                    <Upload className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">
                    {isDragging ? 'Drop files instantly' : 'Upload Assets'}
                </h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
                    Drag & drop your digital products, or click to browse. We support high-res images, PDFs, and ZIPs.
                </p>

                <span className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300
          bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95
        ">
                    Select Files
                </span>
            </div>
        </div>
    )
}
