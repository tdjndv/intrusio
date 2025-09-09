// app/game/page.tsx
import { supabase } from '../../lib/supabaseClient'
import GameClient from './GameClient'

type Row = { word: string; groupid: string }

export default async function GamePage(
 {
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const sp = await searchParams;           // ✅ await the object, not the property
  const lang = sp?.lang ?? 'en';

  const { data, error } = await supabase
    .from('vocab')
    .select('word, groupid')
    .eq('lang', lang) // change to 'language' if that's your column

  const rows = (data ?? []) as Row[]

  return <GameClient lang={lang} rows={rows} />
}
