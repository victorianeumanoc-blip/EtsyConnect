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
            className={`relative group cursor-pointer transition-all duration-300 overflow-hidden
        p-12 border-2 border-dashed rounded-2xl text-center
        ${isDragging
                    ? 'border-[#F1641E] bg-[#FFF3ED] scale-[1.01]'
                    : 'border-[#D6D6D6] bg-white hover:bg-[#FFF3ED]/30 hover:border-[#F1641E]/50'
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

            <div className="relative z-10 flex flex-col items-center pointer-events-none">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
          ${isDragging
                        ? 'bg-[#F1641E] text-white scale-110 rotate-3'
                        : 'bg-[#FFF3ED] text-[#F1641E] group-hover:scale-105 group-hover:-rotate-2'
                    }
        `}>
                    <Upload className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-[#222222]">
                    {isDragging ? 'Drop your files here' : 'Upload your assets'}
                </h3>
                <p className="text-[#757575] mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                    Drag & drop your digital products, or click to browse. We support images, PDFs, and ZIP archives.
                </p>

                <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
          bg-[#222222] text-white hover:bg-[#000000] active:scale-95 shadow-sm
        ">
                    Select Files
                </span>
            </div>
        </div>
    )
}
