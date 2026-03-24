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

      toast({ title: 'Payment Successful', description: 'Your payment was processed successfully.' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkPay = async () => {\;

code = code.replace(t1, r1);

// We replace the specific string chunk
code = code.replace(
\              </div>
            </div>
          </div>
        </div>
      );
    };\,
\              </div>
            </div>
          </div>
          {fee.status !== 'paid' && (
            <div className="flex flex-col justify-end ml-0 md:ml-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 min-w-[120px]">
               <Button onClick={() => handleSinglePay(fee.id)} disabled={isProcessing} className="w-full h-full min-h-[4rem] text-md gap-2" variant="default"><CreditCard className="w-5 h-5"/> Pay</Button>
            </div>
          )}
        </div>
      );
    };\);
fs.writeFileSync('src/pages/student/StudentFees.tsx', code, 'utf8');