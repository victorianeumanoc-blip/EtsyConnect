// Etsy OAuth 2.0 with PKCE
// Docs: https://developers.etsy.com/documentation/essentials/authentication

const ETSY_API_KEY = import.meta.env.VITE_ETSY_API_KEY || ''
const ETSY_REDIRECT_URI = import.meta.env.VITE_ETSY_REDIRECT_URI || window.location.origin
const ETSY_AUTH_URL = 'https://www.etsy.com/oauth/connect'
const ETSY_TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token'

// --- PKCE Helpers ---

function generateCodeVerifier() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

// --- OAuth Flow ---

export async function startEtsyOAuth() {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const state = crypto.randomUUID()

    // Store for callback
    sessionStorage.setItem('etsy_code_verifier', verifier)
    sessionStorage.setItem('etsy_oauth_state', state)

    const scopes = [
        'listings_r',
        'listings_w',
        'listings_d',
        'shops_r',
        'shops_w',
        'profile_r',
    ]

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: ETSY_API_KEY,
        redirect_uri: ETSY_REDIRECT_URI,
        scope: scopes.join(' '),
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
    })

    window.location.href = `${ETSY_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForToken(code) {
    const verifier = sessionStorage.getItem('etsy_code_verifier')

    if (!verifier) {
        throw new Error('Missing PKCE code verifier. Please try connecting again.')
    }

    const response = await fetch(ETSY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: ETSY_API_KEY,
            redirect_uri: ETSY_REDIRECT_URI,
            code,
            code_verifier: verifier,
        }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error_description || 'Failed to exchange authorization code')
    }

    const tokenData = await response.json()

    // Store tokens
    const connectionData = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
        token_type: tokenData.token_type,
    }

    localStorage.setItem('etsy_connection', JSON.stringify(connectionData))

    // Clean up session storage
    sessionStorage.removeItem('etsy_code_verifier')
    sessionStorage.removeItem('etsy_oauth_state')

    return connectionData
}

export async function refreshAccessToken() {
    const connection = getStoredConnection()
    if (!connection?.refresh_token) {
        throw new Error('No refresh token available')
    }

    const response = await fetch(ETSY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: ETSY_API_KEY,
            refresh_token: connection.refresh_token,
        }),
    })

    if (!response.ok) {
        disconnectEtsy()
        throw new Error('Session expired. Please reconnect your shop.')
    }

    const tokenData = await response.json()
    const updatedConnection = {
        ...connection,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
    }

    localStorage.setItem('etsy_connection', JSON.stringify(updatedConnection))
    return updatedConnection
}

// --- API Calls ---

async function etsyFetch(endpoint) {
    let connection = getStoredConnection()
    if (!connection) throw new Error('Not connected to Etsy')

    // Auto-refresh if token expired
    if (Date.now() >= connection.expires_at) {
        connection = await refreshAccessToken()
    }

    const response = await fetch(`https://openapi.etsy.com${endpoint}`, {
        headers: {
            Authorization: `Bearer ${connection.access_token}`,
            'x-api-key': ETSY_API_KEY,
        },
    })

    if (!response.ok) {
        if (response.status === 401) {
            connection = await refreshAccessToken()
            const retry = await fetch(`https://openapi.etsy.com${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${connection.access_token}`,
                    'x-api-key': ETSY_API_KEY,
                },
            })
            if (!retry.ok) throw new Error('API request failed after token refresh')
            return retry.json()
        }
        throw new Error(`Etsy API error: ${response.status}`)
    }

    return response.json()
}

export async function fetchUserProfile() {
    return etsyFetch('/v3/application/users/me')
}

export async function fetchShopInfo() {
    const user = await fetchUserProfile()
    const shops = await etsyFetch(`/v3/application/users/${user.user_id}/shops`)
    return {
        user,
        shop: shops.results?.[0] || null,
    }
}

// --- Connection Management ---

export function getStoredConnection() {
    try {
        const data = localStorage.getItem('etsy_connection')
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

export function getStoredShopInfo() {
    try {
        const data = localStorage.getItem('etsy_shop_info')
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

export function saveShopInfo(info) {
    localStorage.setItem('etsy_shop_info', JSON.stringify(info))
}

export function disconnectEtsy() {
    localStorage.removeItem('etsy_connection')
    localStorage.removeItem('etsy_shop_info')
}

export function isConnected() {
    const connection = getStoredConnection()
    return !!connection?.access_token
}

export function hasApiKey() {
    return !!ETSY_API_KEY
}
