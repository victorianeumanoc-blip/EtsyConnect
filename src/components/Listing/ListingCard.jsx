import { useState } from 'react'
import { Sparkles, Copy, Trash2, RefreshCw, Tag, Image as ImageIcon } from 'lucide-react'

export function ListingCard({ listing, onUpdate, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        onUpdate(listing.id, { ...listing, [name]: value })
    }

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim())
        onUpdate(listing.id, { ...listing, tags })
    }

    return (
        <div className={`bg-white border rounded-2xl p-5 transition-all duration-300 shadow-sm ${isExpanded ? 'border-[#F1641E] ring-2 ring-[#F1641E]/10' : 'border-[#D6D6D6] hover:border-[#B0B0B0] hover:shadow-md'}`}>
            <div className="flex items-start gap-5">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-[#F1F1F1] rounded-xl shrink-0 flex items-center justify-center border border-[#D6D6D6] overflow-hidden">
                    {listing.file && listing.file.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(listing.file)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-[#B0B0B0]" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                            <input
                                type="text"
                                name="title"
                                value={listing.title}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-transparent hover:border-[#D6D6D6] focus:border-[#F1641E] focus:outline-none w-full font-semibold text-lg text-[#222222] placeholder-[#B0B0B0] transition-colors py-1"
                                placeholder="Listing Title"
                            />
                            <p className="text-xs text-[#757575] font-mono truncate">{listing.fileName}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button className="p-2 text-[#757575] hover:text-[#F1641E] hover:bg-[#FFF3ED] rounded-lg transition-colors" title="Regenerate">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(listing.id)} className="p-2 text-[#757575] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <Tag className="w-3.5 h-3.5 absolute top-2.5 left-3 text-[#B0B0B0]" />
                            <input
                                type="text"
                                value={listing.tags.join(', ')}
                                onChange={handleTagsChange}
                                className="w-full pl-8 py-2 text-sm bg-[#FAF9F7] border border-[#D6D6D6] rounded-lg text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/20 transition-all"
                                placeholder="Tags (comma separated)"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute top-2 left-3 text-[#757575] text-sm">$</span>
                            <input
                                type="number"
                                name="price"
                                value={listing.price}
                                onChange={handleChange}
                                className="w-full pl-6 py-2 text-sm bg-[#FAF9F7] border border-[#D6D6D6] rounded-lg text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F1641E] focus:ring-1 focus:ring-[#F1641E]/20 transition-all"
                                placeholder="Price"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-4 pt-4 border-t border-[#F1F1F1]">
                <label className="text-xs font-medium text-[#757575] mb-2 block uppercase tracking-wider">Description</label>
                <textarea
                    name="description"
                    value={listing.description}
                    onChange={handleChange}
                    rows={isExpanded ? 8 : 3}
                    className="w-full bg-[#FAF9F7] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#222222] focus:border-[#F1641E] focus:ring-2 focus:ring-[#F1641E]/10 outline-none transition-all resize-y placeholder-[#B0B0B0]"
                    placeholder="Product description..."
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setIsExpanded(false)}
                />
            </div>
        </div>
    )
}
