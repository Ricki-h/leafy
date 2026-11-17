const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

// Estilo Twitter: "agora", "30s", "12min", "3h", "10 de jul", "10 de jul de 2025"
export function formatPostDate(iso) {
    const date = new Date(iso)
    if (isNaN(date)) return ''

    const now = new Date()
    const seconds = Math.max(0, Math.floor((now - date) / 1000))

    if (seconds < 5) return 'agora'
    if (seconds < 60) return `${seconds}s`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}min`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`

    const dia = date.getDate()
    const mes = MESES[date.getMonth()]

    if (date.getFullYear() === now.getFullYear()) return `${dia} de ${mes}`
    return `${dia} de ${mes} de ${date.getFullYear()}`
}

// Data completa, para o tooltip ou a tela do post: "14:03 · 10 de jul de 2026"
export function formatPostFullDate(iso) {
    const date = new Date(iso)
    if (isNaN(date)) return ''

    const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const dia = date.getDate()
    const mes = MESES[date.getMonth()]

    return `${hora} · ${dia} de ${mes} de ${date.getFullYear()}`
}