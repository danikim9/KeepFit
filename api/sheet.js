// CSV feed for the Google Sheet: =IMPORTDATA("https://<site>/api/sheet?t=wtp&token=...")
// The token is checked inside Supabase (public.keepfit_export); this function only turns the rows into CSV.
const SB_RPC = 'https://rracrasaytpbsqgmyvku.supabase.co/rest/v1/rpc/keepfit_export'
const SB_KEY = 'sb_publishable_A0jk6iWbF3zS5nhjlQW2aw_chITJiz2'

function cell(v) {
  if (v === null || v === undefined) return ''
  let s = String(v)
  // free-text answers must not run as formulas in the sheet
  if (typeof v === 'string' && /^[=+\-@]/.test(s)) s = "'" + s
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default async function handler(req, res) {
  const { t, token } = req.query
  if (t !== 'wtp' && t !== 'events') return res.status(400).send('t must be wtp or events')

  const r = await fetch(SB_RPC, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_token: token || '', p_table: t }),
  })
  if (!r.ok) return res.status(r.status < 500 ? 403 : 502).send(r.status < 500 ? 'forbidden' : 'upstream error')

  const { columns, rows } = await r.json()
  const csv = [columns, ...rows].map((row) => row.map(cell).join(',')).join('\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).send(csv)
}
