import { getCurrentUser } from "@/backend/services/authService";

export async function addNote(word: string, explain: string) {
    const currentUser = await getCurrentUser();

    const res = await fetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ word, explain, userId: currentUser?.id }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })

    if (!res.ok) {
        throw new Error('Failed to add note')
    }

    return res.json()
}
