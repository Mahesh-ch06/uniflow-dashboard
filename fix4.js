const fs = require('fs');
let code = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

const t1 = \  const handleBulkPay = async () => {\;
const r1 = \  const handleSinglePay = async (feeId: string) => {
    setIsProcessing(true);
    try {
      const fee = myFees.find((f: any) => f.id === feeId);
      if (!fee) return;
      const lateFee = fee.status !== 'paid' && fee.due_date ? calculateLateFee(fee.due_date) : 0;
      const totalAmount = fee.amount + lateFee;
      const remainingAmount = totalAmount - fee.paid_amount;
      if (remainingAmount <= 0) return;

      const { error: paymentError } = await supabase.from('student_payments').insert({
        student_id: studentUUID,
        fee_id: fee.id,
        amount: remainingAmount,
        payment_method: 'card',
        status: 'success'
      });
      if (paymentError) throw paymentError;

      const { error: feeError } = await supabase.from('student_fees').update({
        paid_amount: totalAmount,
        status: 'paid'
      }).eq('id', fee.id);
      if (feeError) throw feeError;

      toast({ title: 'Payment Successful' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkPay = async () => {\;

code = code.replace(t1, r1);

// We find the exact line to insert after using split
let lines = code.split('\\n');
let modified = [];
for (let i = 0; i < lines.length; i++) {
    modified.push(lines[i]);
    if (lines[i].includes('₹{totalWithLate.toLocaleString("en-IN")}</p>')) {
        // We know the structure:
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        // So we add the closing divs, then our button, then the last closing div.
        // We can just append the 3 closing divs from the next lines, then insert the button.
        let j = 1;
        let divsSeen = 0;
        while(i + j < lines.length && divsSeen < 3) {
            if (lines[i+j].includes('</div>')) {
               modified.push(lines[i+j]);
               divsSeen++;
            } else {
               modified.push(lines[i+j]);
            }
            j++;
        }
        modified.push('          {fee.status !== \\'paid\\' && (');
        modified.push('            <div className="flex flex-col justify-end ml-0 md:ml-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 min-w-[120px]">');
        modified.push('               <Button onClick={() => handleSinglePay(fee.id)} disabled={isProcessing} className="w-full h-full min-h-[4rem] text-md gap-2" variant="default"><CreditCard className="w-5 h-5"/> Pay</Button>');
        modified.push('            </div>');
        modified.push('          )}');
        
        // Skip the next div
        while (i + j < lines.length && !lines[i+j].includes('</div>')) {
             modified.push(lines[i+j]);
             j++;
        }
        modified.push(lines[i+j]); // the 4th closing div
        
        i = i + j;
    }
}
code = modified.join('\\n');

fs.writeFileSync('src/pages/student/StudentFees.tsx', code, 'utf8');