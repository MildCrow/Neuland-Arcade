/* Verbindung zu Supabase (optional).
   Leer lassen = Offline-Modus (alles bleibt nur in diesem Browser).
   Ausfüllen = echte Konten und eine gemeinsame Weltrangliste.
   Beide Werte stehen in Supabase unter Project Settings > API.
   Nimm NUR den "anon public" Schlüssel, niemals den "service_role" Schlüssel */
window.NL_CONFIG = {
  supabaseUrl: 'https://fsdprgfhsftkfyiswfdx.supabase.co',    // z.B. 'https://abcdxyz.supabase.co'
  supabaseURL: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZHByZ2Zoc2Z0a2Z5aXN3ZmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NjQ3OTksImV4cCI6MjEwNzM0MDc5OX0.xDHkrXi4XfcYP_Wal6ch41kY3SqoVRAjflTGc6osxjM',    // der lange "anon public" Schlüssel
  adminHash: ''      // Admin-Code als Hash. Leer = Standardcode. Neue Zeile erzeugst du im Admin-Bereich.
};
