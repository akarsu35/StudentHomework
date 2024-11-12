import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eovjawufclxycdtixiqa.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdmphd3VmY2x4eWNkdGl4aXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMjU3MzUsImV4cCI6MjA0NjgwMTczNX0.S-3lBKuo9ovaKSH4mpBEh9zU1bzf543lKqSsOBDrrvg'

const supabase = createClient(supabaseUrl, supabaseKey)

// Doğru şekilde dışa aktarıyoruz
export { supabase }
