import { useState, useCallback } from 'react'
import { Layout } from './components/Layout/Layout'
import { FileUploader } from './components/Upload/FileUploader'
import { GlobalForm } from './components/Upload/GlobalForm'
import { ListingCard } from './components/Listing/ListingCard'
import { generateEtsyCSV, downloadCSV } from './utils/csv'
import { FileText, Sparkles, Upload as UploadIcon, ArrowRight, Download, CheckCircle2 } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [listings, setListings] = useState([])
  const [globalData, setGlobalData] = useState({
    baseTitle: '',
    baseDescription: '',
    keywords: '',
    price: ''
  })

  const handleUpload = useCallback((files) => {
    console.log('Uploaded files:', files)
    const newListings = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      title: '', // Pending AI generation
      description: '', // Pending AI generation
      tags: [],
      price: '',
      quantity: 999,
      status: 'pending' // pending, generated, ready
    }))

    setListings(prev => [...prev, ...newListings])
  }, [])

  const handleGlobalUpdate = useCallback((data) => {
    setGlobalData(data)
  }, [])

  const handleGenerate = () => {
    // Logic to apply global data to listings and "generate" content
    if (listings.length === 0) {
      alert('Please upload files first.')
      return
    }

    // Simulating generation with delay for effect
    const updatedListings = listings.map(l => ({
      ...l,
      title: l.status === 'generated' ? l.title : `${globalData.baseTitle} - ${l.fileName} - Unique Variation`,
      description: l.status === 'generated' ? l.description : globalData.baseDescription + `\n\nSpecific details for ${l.fileName}...`,
      price: l.price || globalData.price,
      tags: l.tags.length > 0 ? l.tags : globalData.keywords.split(',').map(k => k.trim()).filter(k => k),
      status: 'generated'
    }))

    setListings(updatedListings)
    setActiveTab('listings')
  }

  const handleUpdateListing = (id, updatedData) => {
    setListings(prev => prev.map(l => l.id === id ? updatedData : l))
  }

  const handleDeleteListing = (id) => {
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const handleExport = () => {
    if (listings.length === 0) return
    const csvContent = generateEtsyCSV(listings)
    downloadCSV(csvContent, 'etsy-listings.csv')
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'upload' && (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
                Upload & Configure
              </h2>
              <p className="text-slate-400 text-lg max-w-xl">
                Upload your digital assets and define global parameters to automatically generate optimized Etsy listings.
              </p>
            </div>
            {listings.length > 0 && (
              <button
                onClick={handleGenerate}
                className="group btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Generate Listings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <FileUploader onUpload={handleUpload} />

              {listings.length > 0 && (
                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Ready for Generation ({listings.length})
                    </h4>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {listings.filter(l => l.status === 'generated').length} Generated
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {listings.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 hover:bg-slate-900/60 transition-colors group">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-slate-200 truncate">{l.fileName}</span>
                            <span className="text-xs text-slate-500">{l.status}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteListing(l.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <GlobalForm onUpdate={handleGlobalUpdate} />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800/50">
            {[
              { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Smart Templates', desc: 'Define global rules for consistency.' },
              { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'AI Generation', desc: 'Auto-generate titles & descriptions.' },
              { icon: UploadIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Bulk Export', desc: 'Download CSV for Etsy upload.' }
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="font-semibold text-slate-200 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {listings.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800/50">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                <Sparkles className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No listings generated yet</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Upload your files in the "Upload" tab to start generating your Etsy listings.</p>
              <button onClick={() => setActiveTab('upload')} className="btn bg-white text-slate-900 px-6 py-2.5 rounded-full font-medium hover:bg-indigo-50 transition-colors">
                Go to Upload
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between sticky top-24 z-30 bg-[#020617]/80 backdrop-blur-xl py-4 -my-4 px-4 bg-clip-padding rounded-xl border border-slate-800/50">
                <div>
                  <h2 className="text-2xl font-bold text-white">Review Listings</h2>
                  <p className="text-slate-400 text-sm">Reviewing {listings.length} items</p>
                </div>
                <button onClick={handleExport} className="btn bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="space-y-6 pt-4">
                {listings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onUpdate={handleUpdateListing}
                    onDelete={handleDeleteListing}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  )
}

export default App
