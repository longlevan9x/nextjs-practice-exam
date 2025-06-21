// app/api/notes/route.ts
import { createClient } from '@/backend/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase.from('notes').select('*')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const body = await req.json()
    const { word, explain, userId } = body

    const { data, error } = await supabase
        .from('notes')
        .insert([{ word, explain, userId }])

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
}
