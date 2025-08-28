import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const SUPABASE_URL = 'https://kabdokfowpwrdgywjtfv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'

// Initialize client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function insertProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: crypto.randomUUID(),          // generates a uuid for id
        user_id: crypto.randomUUID(),     // uuid for user_id
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_admin: false
      }
    ])
    .select()

  if (error) {
    console.error('Error inserting data:', error)
  } else {
    console.log('Inserted row:', data)
  }
}

insertProfile()
