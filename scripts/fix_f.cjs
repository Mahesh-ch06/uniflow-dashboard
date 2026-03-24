const fs = require('fs');
let sfTsx = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

sfTsx = sfTsx.replace(
    '  const fetchData = async () => {\n    try {\n      setLoading(true);\n      const [feesRes, paymentsRes] = await Promise.all([\n        supabase.from("student_fees").select("*").eq("student_id", user?.id),\n        supabase.from("student_payments").select("*").eq("student_id", user?.id).order("created_at", { ascending: false })\n      ]);',

    '  const [studentUUID, setStudentUUID] = useState<string>("");\n\n  const fetchData = async () => {\n    try {\n      setLoading(true);\n\n      const { data: studentData, error: studentError} = await supabase.from("students").select("id").eq("hall_ticket_no", user?.id).single();\n\n      if(studentError || !studentData) throw new Error("Student data not found");\n      const currentUUID = studentData.id;\n      setStudentUUID(currentUUID);\n\n      const [feesRes, paymentsRes] = await Promise.all([\n        supabase.from("student_fees").select("*").eq("student_id", currentUUID),\n        supabase.from("student_payments").select("*").eq("student_id", currentUUID).order("created_at", { ascending: false })\n      ]);'
);

sfTsx = sfTsx.replace(
    '          const pRes = await supabase.from("student_payments").insert({\n            student_id: user?.id,',
    '          const pRes = await supabase.from("student_payments").insert({\n            student_id: studentUUID,'
);

fs.writeFileSync('src/pages/student/StudentFees.tsx', sfTsx, 'utf8');
