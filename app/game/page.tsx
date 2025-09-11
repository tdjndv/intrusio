// app/game/page.tsx
import { supabase } from '../../lib/supabaseClient'
import GameClient from './GameClient'

type Row = { word: string; groupid: string; lang: string; sample_sentence: string }

export default async function GamePage(
 {
  searchParams,
}: {
  searchParams: Promise<{ lang?: string, defaultLang?: string }>
}) {
  const sp = await searchParams;           // ✅ await the object, not the property
  const lang = sp?.lang ?? 'en';
  const defaultLang = sp?.defaultLang ?? 'en';

  const { data, error } = await supabase
    .from('vocab_latest')
    .select('word, groupid, lang, sample_sentence')
    .or(`lang.eq.${lang},lang.eq.${defaultLang}`);

  const rows = (data ?? []) as Row[]

  return <GameClient lang={lang} rows={rows} defaultLang={defaultLang}/>
}
