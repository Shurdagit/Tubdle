import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Läs av datan som skickades från spelet
    const body = await request.json();
    const { attempts, solved } = body;

    // Spara till databasen (kräver att du skapat tabellen 'game_sessions' i Vercel)
    await sql`
      INSERT INTO game_sessions (attempts, solved) 
      VALUES (${attempts}, ${solved})
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Databasfel:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}