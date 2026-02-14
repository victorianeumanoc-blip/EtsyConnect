export function generateEtsyCSV(listings) {
    // Define standard CSV columns
    // Note: This is a simplified set based on common requirements. 
    // Real marketplace CSVs have many explicit columns depending on the category.
    const columns = [
        'Title',
        'Description',
        'Price',
        'Quantity',
        'Tags',
        'Materials',
        'Shop Section',
        'Category',
        'Renewal Option',
        'Processing Time',
        // ... add more as needed
    ]

    const header = columns.join(',')

    const rows = listings.map(listing => {
        // Helper to escape CSV values
        const escape = (val) => {
            if (val === null || val === undefined) return ''
            const stringVal = String(val)
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
                return `"${stringVal.replace(/"/g, '""')}"`
            }
            return stringVal
        }

        const rowData = [
            listing.title,
            listing.description,
            listing.price,
            listing.quantity,
            listing.tags.join(','), // tags are usually comma separated in one field or separate columns. keeping simple.
            '', // Materials
            '', // Shop Section
            'Digital Print', // Category placeholder
            'Manual', // Renewal
            'Instant', // Processing
        ]

        return rowData.map(escape).join(',')
    })

    return [header, ...rows].join('\n')
}

export function downloadCSV(content, filename = 'etsy-listings.csv') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
