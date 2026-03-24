const fs = require('fs');
let sfTsx = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

sfTsx = sfTsx.replace(
`  const fetchData = async () => {
    try {
      setLoading(true);
      const [feesRes, paymentsRes] = await Promise.all([
        supabase.from("student_fees").select("*").eq("student_id", user?.id),
        supabase.from("student_payments").select("*").eq("student_id", user?.id).order("created_at", { ascending: false })
      ]);`,
`  const [studentUUID, setStudentUUID] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('hall_ticket_no', user?.id)
        .single();
        
      if (studentError || !studentData) throw new Error("Student record not found for fees");
      const currentUUID = studentData.id;
      setStudentUUID(currentUUID);

      const [feesRes, paymentsRes] = await Promise.all([
        supabase.from("student_fees").select("*").eq("student_id", currentUUID),
        supabase.from("student_payments").select("*").eq("student_id", currentUUID).order("created_at", { ascending: false })
      ]);`
);

sfTsx = sfTsx.replace(
`          const pRes = await supabase.from("student_payments").insert({
            student_id: user?.id,`,
`          const pRes = await supabase.from("student_payments").insert({
            student_id: studentUUID || user?.id,`
);

fs.writeFileSync('src/pages/student/StudentFees.tsx', sfTsx, 'utf8');
console.log("StudentFees.tsx updated.");
