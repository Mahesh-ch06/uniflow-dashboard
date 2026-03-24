import { createClient } from '@supabase/supabase-js';
import { allStudents } from './src/lib/mock-data.js';

import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addStudents() {
  console.log(`Found ${allStudents.length} students to insert.`);
  
  // To avoid hitting payload limits, we will insert them in batches of 50
  const chunk_size = 50;
  for (let i = 0; i < allStudents.length; i += chunk_size) {
    const chunk = allStudents.slice(i, i + chunk_size);
    
    // Map to the database schema matching `students` table
    const dbStudents = chunk.map(s => ({
      hall_ticket_no: s.id,
      name: s.name,
      batch_name: s.batch,
      department: s.department,
      password: 'UniManage@2026'
    }));

    const { error } = await supabase
      .from('students')
      .upsert(dbStudents, { onConflict: 'hall_ticket_no' });

    if (error) {
      console.error(`Error adding students chunk ${i} to ${i + chunk_size}:`, error.message);
    } else {
      console.log(`Successfully added students ${i} through ${i + chunk.length}`);
    }
  }
  
  console.log('Finished inserting all students!');
}

addStudents();
