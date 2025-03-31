// pages/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uwomnsxllyftjvedfkup.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3b21uc3hsbHlmdGp2ZWRma3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjQ3MDcsImV4cCI6MjA1ODQwMDcwN30.uV84j80gcqr1--8b_bVUO62gM09pRdZ2yVfNMqIce5Y'

export const supabase = createClient(supabaseUrl, supabaseKey)
