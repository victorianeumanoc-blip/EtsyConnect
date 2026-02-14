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
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-slate-700/50">
          <Layout className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Global Listing Rules</h3>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Base parameters for AI generation</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 group">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors group-focus-within:text-indigo-400">
            <Type className="w-4 h-4" /> Base Title Template
          </label>
          <input
            type="text"
            name="baseTitle"
            value={formData.baseTitle}
            onChange={handleChange}
            placeholder="e.g. Minimalist Abstract Wall Art Print"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all font-medium"
          />
          <p className="text-xs text-slate-500 pl-1">The AI will generate SEO-optimized variations based on this core title.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors group-focus-within:text-indigo-400">
              <DollarSign className="w-4 h-4" /> Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5.00"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all font-mono"
              />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors group-focus-within:text-indigo-400">
              <Tag className="w-4 h-4" /> Keywords
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="art, digital, ..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors group-focus-within:text-indigo-400">
            <FileText className="w-4 h-4" /> Base Description
          </label>
          <textarea
            name="baseDescription"
            value={formData.baseDescription}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the key features, easy download process, and file sizes included..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 transition-all resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
