const fs = require('fs');
let code = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

const t2 = \              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="font-bold text-success">?{fee.paid_amount.toLocaleString("en-IN")} /
?{totalWithLate.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>\;

console.log(code.indexOf(t2));
