export default function localStore(id: string, name: string): void {
    const prevStorage = JSON.parse(
        localStorage.getItem('previous') || '[]'
    ) as { id: string; name: string; dateModified: Date }[]
    if (prevStorage.length === 0) {
        localStorage.setItem(
            'previous',
            JSON.stringify([{ id, name, dateModified: new Date() }])
        )
    } else {
        if (prevStorage.some((item) => item.id === id)) {
            return
        }
        prevStorage.push({ id, name, dateModified: new Date() })
        localStorage.setItem('previous', JSON.stringify(prevStorage))
    }
}
