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
        <div className={`card bg-slate-900/50 border-slate-800 transition-all duration-300 ${isExpanded ? 'ring-2 ring-indigo-500/50' : 'hover:border-slate-700'}`}>
            <div className="flex items-start gap-4">
                {/* Thumbnail Placeholder */}
                <div className="w-24 h-24 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center border border-slate-700">
                    {listing.file && listing.file.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(listing.file)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                </div>

                {/* Content Preview */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 w-full mr-4">
                            <input
                                type="text"
                                name="title"
                                value={listing.title}
                                onChange={handleChange}
                                className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-full font-medium text-lg text-white placeholder-slate-600 transition-colors py-1"
                                placeholder="Listing Title"
                            />
                            <p className="text-xs text-slate-500 font-mono truncate">{listing.fileName}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors" title="Regenerate AI">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(listing.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Tag className="w-3 h-3 absolute top-3 left-3 text-slate-500" />
                            <input
                                type="text"
                                value={listing.tags.join(', ')}
                                onChange={handleTagsChange}
                                className="input pl-8 py-2 text-sm bg-slate-950/30 border-slate-800"
                                placeholder="Tags (comma separated)"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute top-2 left-3 text-slate-500 text-sm">$</span>
                            <input
                                type="number"
                                name="price"
                                value={listing.price}
                                onChange={handleChange}
                                className="input pl-6 py-2 text-sm bg-slate-950/30 border-slate-800"
                                placeholder="Price"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Area - Always visible but styled nicely */}
            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Description</label>
                <textarea
                    name="description"
                    value={listing.description}
                    onChange={handleChange}
                    rows={isExpanded ? 8 : 3}
                    className="w-full bg-slate-950/30 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y"
                    placeholder="Product description..."
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setIsExpanded(false)}
                />
            </div>
        </div>
    )
}
