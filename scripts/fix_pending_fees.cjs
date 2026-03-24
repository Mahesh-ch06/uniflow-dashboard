const fs = require('fs');
let content = fs.readFileSync('src/pages/student/StudentDashboard.tsx', 'utf8');

const replacement = \        const { data: feesData } = await supabase
          .from('student_fees')
          .select('amount, amount_paid, due_date, status')
          .eq('student_id', studentData.id)
          .neq('status', 'paid');

        if (feesData) {
          const calculateLateFee = (dueDate) => {
            if (!dueDate) return 0;
            const due = new Date(dueDate);
            const now = new Date();
            if (now > due) {
              const diffTime = Math.abs(now.getTime() - due.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays * 10;
            }
            return 0;
          };

          const totalPending = feesData.reduce((sum, fee) => {
            const amount = Number(fee.amount || 0);
            const paid = Number(fee.amount_paid || 0);
            const r = amount - paid;
            const late = fee.status !== 'paid' ? calculateLateFee(fee.due_date) : 0;
            return sum + (r > 0 ? r + late : 0);
          }, 0);
          
          setPendingFees(totalPending > 0 ? "?" + totalPending.toLocaleString('en-IN') : "?0");
        }\;

// regex replace
content = content.replace(/const \{ data: feesData \} = await supabase[\s\S]*?setPendingFees\([^)]+\);\s*}/, replacement);

fs.writeFileSync('src/pages/student/StudentDashboard.tsx', content);
