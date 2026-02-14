import { Upload, Download, Settings, Github, Sparkles } from 'lucide-react'

export function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#222222]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#D6D6D6] shadow-sm">
                <div className="container h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer group">
                        <img src="/favicon.svg" alt="ET Connect" className="w-9 h-9 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200" />
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-xl font-bold text-[#222222] tracking-tight">
                                ET Connect
                            </h1>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F1641E] bg-[#FFF3ED] px-1.5 py-0.5 rounded-md border border-[#F1641E]/20">
                                Beta
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 p-1 bg-[#F1F1F1] rounded-lg">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'upload'
                                ? 'bg-white text-[#222222] shadow-sm border border-[#D6D6D6]'
                                : 'text-[#757575] hover:text-[#222222] hover:bg-white/50'
                                }`}
                        >
                            <Upload className="w-4 h-4" /> Upload
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'listings'
                                ? 'bg-white text-[#222222] shadow-sm border border-[#D6D6D6]'
                                : 'text-[#757575] hover:text-[#222222] hover:bg-white/50'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" /> Listings
                        </button>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-[#757575] hover:text-[#222222] rounded-lg hover:bg-[#F1F1F1] transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#222222] text-white rounded-full font-medium text-sm hover:bg-[#000000] transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container py-10 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#D6D6D6] py-6 bg-white">
                <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-[#757575] gap-4">
                    <p>© 2024 ET Connect. Local AI Tool.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-[#222222] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#222222] transition-colors">Terms of Service</a>
                        <a href="#" className="flex items-center gap-2 hover:text-[#222222] transition-colors">
                            <Github className="w-4 h-4" />
                            <span>Source</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
