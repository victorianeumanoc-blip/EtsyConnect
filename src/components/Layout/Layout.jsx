import { Upload, Download, Settings, Github, Sparkles } from 'lucide-react'

export function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] mix-blend-screen animate-pulse duration-7000" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] mix-blend-screen" />
            </div>

            {/* Header */}
            <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50 transition-all duration-300">
                <div className="container h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight">
                                Etsy Connect
                            </h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                Beta
                            </span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-1 p-1.5 bg-slate-900/50 rounded-full border border-slate-800/50 backdrop-blur-md shadow-inner">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === 'upload'
                                    ? 'text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            {activeTab === 'upload' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Upload
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === 'listings'
                                    ? 'text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            {activeTab === 'listings' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Listings
                            </span>
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                            <Settings className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-slate-800" />
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container pt-28 pb-12 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-8 bg-slate-950/50 backdrop-blur-sm">
                <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-4">
                    <p>© 2024 Etsy Connect. Local AI Tool.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                            <span>Source</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
