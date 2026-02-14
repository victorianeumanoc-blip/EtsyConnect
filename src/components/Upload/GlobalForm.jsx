import { useState } from 'react'
import { Layout, Tag, DollarSign, Type, FileText } from 'lucide-react'

export function GlobalForm({ onUpdate }) {
  const [formData, setFormData] = useState({
    baseTitle: '',
    baseDescription: '',
    keywords: '',
    price: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  return (
    <div className="bg-white border border-[#D6D6D6] rounded-2xl p-7 space-y-7 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#F1F1F1] pb-5">
        <div className="w-10 h-10 rounded-xl bg-[#FFF3ED] flex items-center justify-center">
          <Layout className="w-5 h-5 text-[#F1641E]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#222222]">Listing Rules</h3>
          <p className="text-[#757575] text-xs font-medium">Base parameters for generation</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#222222] flex items-center gap-2">
            <Type className="w-4 h-4 text-[#757575]" /> Base Title Template
          </label>
          <input
            type="text"
            name="baseTitle"
            value={formData.baseTitle}
            onChange={handleChange}
            placeholder="e.g. Minimalist Abstract Wall Art Print"
            className="w-full bg-[#FAF9F7] border border-[#D6D6D6] rounded-xl px-4 py-3 text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-2 focus:ring-[#F1641E]/20 transition-all text-sm"
          />
          <p className="text-xs text-[#757575] pl-1">AI will generate SEO-optimized variations.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#222222] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#757575]" /> Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-sm">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5.00"
                className="w-full bg-[#FAF9F7] border border-[#D6D6D6] rounded-xl pl-7 pr-4 py-3 text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-2 focus:ring-[#F1641E]/20 transition-all font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#222222] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#757575]" /> Keywords
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="art, digital, ..."
              className="w-full bg-[#FAF9F7] border border-[#D6D6D6] rounded-xl px-4 py-3 text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-2 focus:ring-[#F1641E]/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#222222] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#757575]" /> Base Description
          </label>
          <textarea
            name="baseDescription"
            value={formData.baseDescription}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your product's key features, download format, and file sizes..."
            className="w-full bg-[#FAF9F7] border border-[#D6D6D6] rounded-xl px-4 py-3 text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-2 focus:ring-[#F1641E]/20 transition-all resize-none leading-relaxed text-sm"
          />
        </div>
      </div>
    </div>
  )
}
