const fs = require('fs');
let code = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

const replacement = \              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="font-bold text-success">?{fee.paid_amount.toLocaleString("en-IN")} /
?{totalWithLate.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
          {fee.status !== 'paid' && (
            <div className="flex flex-col justify-end ml-0 md:ml-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 min-w-[120px]">
               <Button onClick={() => handleSinglePay(fee.id)} disabled={isProcessing} className="w-full h-full min-h-[4rem] text-md gap-2" variant="default"><CreditCard className="w-5 h-5"/> Pay</Button>
            </div>
          )}
        </div>\;

code = code.replace(/<div className="text-right">\\s*<p className="text-xs text-muted-foreground">Total Paid<\\/p>\\s*<p className="font-bold\\s*text-success">?\\{fee\\.paid_amount\\.toLocaleString\\("en-IN"\\)\\} \\/\\s*?\\{totalWithLate\\.toLocaleString\\("en-IN"\\)\\}<\\/p>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>/s, replacement);

fs.writeFileSync('src/pages/student/StudentFees.tsx', code, 'utf8');
