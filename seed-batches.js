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

async function addBatchDetails() {
  const batches = [...new Set(allStudents.map(s => s.batch).filter(Boolean))];
  
  console.log(`Found ${batches.length} unique batches.`);
  
  for (const batchName of batches) {
    if (!batchName) continue;
    
    // In this example, we assume there's a 'batches' table with at least 'name' column
    const { data, error } = await supabase
      .from('batches')
      .upsert({ 
        name: batchName,
        created_at: new Date().toISOString()
      }, { onConflict: 'name' })
      .select();

    if (error) {
      console.error(`Error adding batch ${batchName}:`, error.message);
    } else {
      console.log(`Added/Updated batch: ${batchName}`);
    }
  }
}

addBatchDetails();
