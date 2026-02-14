import { useState, useEffect } from 'react'
import {
    Store, ExternalLink, CheckCircle2, XCircle, RefreshCw,
    Shield, Zap, LinkIcon, Unlink, AlertCircle
} from 'lucide-react'
import {
    startEtsyOAuth, fetchShopInfo, disconnectEtsy,
    isConnected, getStoredShopInfo, saveShopInfo
} from '../../utils/etsy'

export function ConnectStore() {
    const [connected, setConnected] = useState(isConnected())
    const [shopInfo, setShopInfo] = useState(getStoredShopInfo())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // If connected but no shop info cached, fetch it
        if (connected && !shopInfo) {
            loadShopInfo()
        }
    }, [connected])

    async function loadShopInfo() {
        setLoading(true)
        setError('')
        try {
            const info = await fetchShopInfo()
            setShopInfo(info)
            saveShopInfo(info)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function handleConnect() {
        startEtsyOAuth()
    }

    function handleDisconnect() {
        disconnectEtsy()
        setConnected(false)
        setShopInfo(null)
        setError('')
    }



    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="space-y-1">
                <h2 className="text-3xl font-bold text-[#222222]">Connect Your Shop</h2>
                <p className="text-[#757575] text-base max-w-lg">
                    Link your Etsy store to publish listings directly from ET Connect.
                </p>
            </div>


            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-red-800 text-sm">Connection Error</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Connection Card */}
            <div className="bg-white border border-[#D6D6D6] rounded-2xl shadow-sm overflow-hidden">
                {connected ? (
                    /* ---- CONNECTED STATE ---- */
                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-[#258635] animate-pulse" />
                            <span className="text-sm font-semibold text-[#258635]">Connected</span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="w-6 h-6 text-[#F1641E] animate-spin" />
                                <span className="ml-3 text-[#757575]">Loading shop info…</span>
                            </div>
                        ) : shopInfo?.shop ? (
                            <div className="space-y-6">
                                {/* Shop Info */}
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#F1F1F1] border border-[#D6D6D6] flex items-center justify-center overflow-hidden">
                                        {shopInfo.shop.icon_url_fullxfull ? (
                                            <img
                                                src={shopInfo.shop.icon_url_fullxfull}
                                                alt={shopInfo.shop.shop_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Store className="w-7 h-7 text-[#B0B0B0]" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#222222]">{shopInfo.shop.shop_name}</h3>
                                        <a
                                            href={shopInfo.shop.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#F1641E] hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            View on Etsy <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>

                                {/* Shop Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Listings', value: shopInfo.shop.listing_active_count ?? '—' },
                                        { label: 'Total Sales', value: shopInfo.shop.transaction_sold_count ?? '—' },
                                        { label: 'Rating', value: shopInfo.shop.review_average ? `${shopInfo.shop.review_average.toFixed(1)} ★` : '—' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-[#FAF9F7] rounded-xl border border-[#F1F1F1] text-center">
                                            <p className="text-2xl font-bold text-[#222222]">{stat.value}</p>
                                            <p className="text-xs text-[#757575] mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={loadShopInfo}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#F1F1F1] hover:bg-[#E8E8E8] text-[#222222] rounded-full text-sm font-medium transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Refresh
                                    </button>
                                    <button
                                        onClick={handleDisconnect}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <Unlink className="w-4 h-4" /> Disconnect
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-10 h-10 text-[#258635] mx-auto mb-3" />
                                <p className="text-[#222222] font-medium">Connected to Etsy</p>
                                <p className="text-[#757575] text-sm mt-1">No shop data available yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ---- NOT CONNECTED STATE ---- */
                    <div>
                        {/* Etsy Header Banner */}
                        <div className="bg-gradient-to-br from-[#F1641E] to-[#D35400] p-10 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 shadow-lg">
                                <Store className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Connect to Etsy</h3>
                            <p className="text-white/80 max-w-md mx-auto text-sm">
                                Securely link your Etsy shop to manage and publish listings directly from ET Connect.
                            </p>
                        </div>

                        {/* Connect Button & Info */}
                        <div className="p-8 space-y-6">
                            <button
                                onClick={handleConnect}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-md bg-[#F1641E] hover:bg-[#D35400] text-white hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <LinkIcon className="w-5 h-5" />
                                Connect with Etsy
                            </button>

                            {/* Permission scopes */}
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-[#757575] uppercase tracking-wider">Permissions requested</p>
                                {[
                                    { icon: Store, label: 'Read & manage your shop information' },
                                    { icon: Zap, label: 'Create, edit & delete listings' },
                                    { icon: Shield, label: 'Read your profile information' },
                                ].map((perm, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[#FAF9F7] rounded-xl border border-[#F1F1F1]">
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF3ED] flex items-center justify-center shrink-0">
                                            <perm.icon className="w-4 h-4 text-[#F1641E]" />
                                        </div>
                                        <span className="text-sm text-[#222222]">{perm.label}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-center text-[#B0B0B0]">
                                You can disconnect at any time. ET Connect never stores your Etsy password.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* How it works */}
            {!connected && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { step: '1', title: 'Get API Key', desc: 'Register at the Etsy Developer Portal to get your application key.' },
                        { step: '2', title: 'Connect', desc: 'Click "Connect with Etsy" and authorize ET Connect to access your shop.' },
                        { step: '3', title: 'Publish', desc: 'Upload files, generate listings, and publish them directly to your store.' },
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-white border border-[#E8E8E8] rounded-2xl hover:border-[#D6D6D6] hover:shadow-md transition-all duration-200">
                            <div className="w-10 h-10 rounded-full bg-[#FFF3ED] flex items-center justify-center mb-4 text-[#F1641E] font-bold text-sm">
                                {item.step}
                            </div>
                            <h4 className="font-semibold text-[#222222] mb-1.5 text-[15px]">{item.title}</h4>
                            <p className="text-sm text-[#757575] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
