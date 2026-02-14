import { useState, useCallback, useEffect } from 'react'
import { Layout } from './components/Layout/Layout'
import { FileUploader } from './components/Upload/FileUploader'
import { GlobalForm } from './components/Upload/GlobalForm'
import { ListingCard } from './components/Listing/ListingCard'
import { ConnectStore } from './components/Settings/ConnectStore'
import { generateEtsyCSV, downloadCSV } from './utils/csv'
import { exchangeCodeForToken, isConnected as checkEtsyConnected } from './utils/etsy'
import { FileText, Sparkles, Upload as UploadIcon, ArrowRight, Download, CheckCircle2, Package, Zap } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [listings, setListings] = useState([])
  const [etsyConnected, setEtsyConnected] = useState(checkEtsyConnected())
  const [globalData, setGlobalData] = useState({
    baseTitle: '',
    baseDescription: '',
    keywords: '',
    price: ''
  })

  // Handle OAuth callback
  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (code) {
      const savedState = sessionStorage.getItem('etsy_oauth_state')
      if (state && state === savedState) {
        exchangeCodeForToken(code)
          .then(() => {
            setEtsyConnected(true)
            setActiveTab('settings')
          })
          .catch((err) => {
            console.error('OAuth error:', err)
          })
          .finally(() => {
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname)
          })
      } else {
        // Clean URL on state mismatch
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  const handleUpload = useCallback((files) => {
    const newListings = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      title: '',
      description: '',
      tags: [],
      price: '',
      quantity: 999,
      status: 'pending'
    }))
    setListings(prev => [...prev, ...newListings])
  }, [])

  const handleGlobalUpdate = useCallback((data) => {
    setGlobalData(data)
  }, [])

  const handleGenerate = () => {
    if (listings.length === 0) {
      alert('Please upload files first.')
      return
    }
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
    downloadCSV(csvContent, 'et-connect-listings.csv')
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isStoreConnected={etsyConnected}>
      {activeTab === 'upload' && (
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-[#222222]">
                Upload & Configure
              </h2>
              <p className="text-[#757575] text-base max-w-lg">
                Upload your digital assets and define global parameters to automatically generate optimized listings.
              </p>
            </div>
            {listings.length > 0 && (
              <button
                onClick={handleGenerate}
                className="group flex items-center gap-2.5 px-7 py-3 bg-[#F1641E] hover:bg-[#D35400] text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Generate Listings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <FileUploader onUpload={handleUpload} />

              {/* File List */}
              {listings.length > 0 && (
                <div className="p-5 bg-white border border-[#D6D6D6] rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#222222] flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#258635]" />
                      Ready for Generation ({listings.length})
                    </h4>
                    <span className="text-xs font-medium text-[#757575] bg-[#F1F1F1] px-2.5 py-1 rounded-full">
                      {listings.filter(l => l.status === 'generated').length} generated
                    </span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {listings.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-3 bg-[#FAF9F7] rounded-xl border border-[#F1F1F1] hover:border-[#D6D6D6] transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 border border-[#D6D6D6]">
                            <FileText className="w-4 h-4 text-[#F1641E]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[#222222] truncate">{l.fileName}</span>
                            <span className="text-xs text-[#757575] capitalize">{l.status}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteListing(l.id)}
                          className="p-1.5 text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <GlobalForm onUpdate={handleGlobalUpdate} />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-[#E8E8E8]">
            {[
              { icon: FileText, color: '#2F466C', bg: '#EFF3F8', title: 'Smart Templates', desc: 'Define global rules once and apply them across all your listings for consistency.' },
              { icon: Sparkles, color: '#7B2D8E', bg: '#F5EFF8', title: 'AI Generation', desc: 'Automatically generate unique, SEO-optimized titles and descriptions.' },
              { icon: Package, color: '#258635', bg: '#EFF8F1', title: 'Bulk Export', desc: 'Download a ready-to-use CSV file for fast bulk uploading to your shop.' }
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-white border border-[#E8E8E8] rounded-2xl hover:border-[#D6D6D6] hover:shadow-md transition-all duration-200">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h4 className="font-semibold text-[#222222] mb-1.5 text-[15px]">{feature.title}</h4>
                <p className="text-sm text-[#757575] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="max-w-5xl mx-auto space-y-8">
          {listings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#D6D6D6]">
              <div className="w-20 h-20 bg-[#F1F1F1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-[#B0B0B0]" />
              </div>
              <h2 className="text-2xl font-bold text-[#222222] mb-3">No listings generated yet</h2>
              <p className="text-[#757575] mb-8 max-w-md mx-auto">
                Upload your files in the "Upload" tab to start generating your listings.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-6 py-2.5 bg-[#222222] text-white rounded-full font-medium text-sm hover:bg-[#000000] transition-colors"
              >
                Go to Upload
              </button>
            </div>
          ) : (
            <>
              {/* Sticky Review Header */}
              <div className="flex items-center justify-between sticky top-[68px] z-30 bg-[#FAF9F7]/90 backdrop-blur-md py-4 -mx-2 px-4 rounded-xl border border-[#E8E8E8]">
                <div>
                  <h2 className="text-2xl font-bold text-[#222222]">Review Listings</h2>
                  <p className="text-[#757575] text-sm">{listings.length} items ready for review</p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#F1641E] hover:bg-[#D35400] text-white rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="space-y-5">
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

      {activeTab === 'settings' && (
        <ConnectStore />
      )}
    </Layout>
  )
}

export default App
