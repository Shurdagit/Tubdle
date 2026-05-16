/**
 * /app/spara-spel/route.tsx
 *
 * API-rutt för att spara och ladda spelstatus i Netlify Blobs (databasen).
 *
 * INSTALLATION (kör en gång i terminalen):
 *   npm install @netlify/blobs
 *
 * Varje spelare identifieras via ett anonymt userId som genereras och
 * sparas i webbläsarens localStorage (se page.tsx). På så sätt kan
 * spelstatusen hämtas och synkroniseras även om localStorage rensas.
 */

import { getStore } from '@netlify/blobs';
import { NextRequest, NextResponse } from 'next/server';

// ─── GET – hämta spelstatus ───────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId saknas' }, { status: 400 });
  }

  try {
    const store = getStore('tubdle-saves');
    const data = await store.get(userId, { type: 'json' });
    return NextResponse.json(data ?? {});
  } catch {
    // Om nyckeln inte finns returnerar vi ett tomt objekt
    return NextResponse.json({});
  }
}

// ─── POST – spara spelstatus ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId saknas' }, { status: 400 });
  }

  try {
    const body = await request.json();

    // Grundläggande validering
    if (
      typeof body.seed !== 'number' ||
      !Array.isArray(body.guesses) ||
      typeof body.gameOver !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Ogiltig speldata' }, { status: 400 });
    }

    const store = getStore('tubdle-saves');
    await store.setJSON(userId, body);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Fel vid sparning:', err);
    return NextResponse.json({ error: 'Serverfel' }, { status: 500 });
  }
}