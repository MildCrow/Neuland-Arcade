/* Verbindung zu Supabase (optional).
   Leer lassen = Offline-Modus (alles bleibt nur in diesem Browser).
   Ausfüllen = echte Konten und eine gemeinsame Weltrangliste.
   Beide Werte stehen in Supabase unter Project Settings > API.
   Nimm NUR den "anon public" Schlüssel, niemals den "service_role" Schlüssel */
window.NL_CONFIG = {
  supabaseUrl: '',    // z.B. 'https://abcdxyz.supabase.co'
  supabaseURL: '',    // der lange "anon public" Schlüssel
  adminHash: ''      // Admin-Code als Hash. Leer = Standardcode. Neue Zeile erzeugst du im Admin-Bereich.
};
