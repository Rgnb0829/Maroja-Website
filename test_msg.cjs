const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';
envFile.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['\n\r\"]/g, '');
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['\n\r\"]/g, '');
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Testing public insert WITHOUT select()...');
    const { data: insData, error: insErr } = await supabase.from('contact_messages').insert([{
        nama: 'Test Robot', phone: '08123', layanan: 'ambulans', pesan: 'Test dari Node'
    }]);
    console.log('Insert Error:', insErr);
    console.log('Insert Data:', insData);

    console.log('\nLogging in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'beresjempol.7@gmail.com',
        password: 'C6@enGky29'
    });

    console.log('Fetching contact_messages as admin...');
    const { data: messages, error: fetchError } = await supabase
        .from('contact_messages')
        .select('*');

    console.log('Messages Count:', messages ? messages.length : 0);
}
check().catch(console.error);
