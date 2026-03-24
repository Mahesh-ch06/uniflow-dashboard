const fs = require('fs');
let sfTsx = fs.readFileSync('src/pages/student/StudentFees.tsx', 'utf8');

sfTsx = sfTsx.replace(
    '  const handleBulkPay = async () => {\n    if (selectedFees.length === 0) return;\n    setIsProcessing(true);\n    let successCount = 0;',
    '  const handleSinglePay = async (feeId: string) => {\n    setIsProcessing(true);\n    try {\n      const fee = myFees.find((f: any) => f.id === feeId);\n      if (!fee) return;\n      const lateFee = fee.status !== "paid" && fee.due_date ? calculateLateFee(fee.due_date) : 0;\n      const totalWithLate = fee.amount + lateFee;\n      const remaining = totalWithLate - fee.paid_amount;\n      if (remaining <= 0) return;\n\n      const pRes = await supabase.from("student_payments").insert({\n        student_id: studentUUID, fee_id: fee.id, amount: remaining, payment_method: "card", status: "success"\n      });\n      if (pRes.error) throw pRes.error;\n\n      const fRes = await supabase.from("student_fees").update({\n        paid_amount: totalWithLate, status: "paid"\n      }).eq("id", fee.id);\n      if (fRes.error) throw fRes.error;\n\n      toast({ title: "Fee paid successfully" });\n      fetchData();\n    } catch(e:any) {\n      toast({ title: "Payment Error", description: e.message, variant: "destructive" });\n    } finally {\n      setIsProcessing(false);\n    }\n  };\n\n  const handleBulkPay = async () => {\n    if (selectedFees.length === 0) return;\n    setIsProcessing(true);\n    let successCount = 0;'
);

sfTsx = sfTsx.replace(
    '              <div className="text-right">\n                <p className="text-xs text-muted-foreground">Total Paid</p>\n                <p className="font-bold text-success">₹{fee.paid_amount.toLocaleString("en-IN")} /\n                ₹{totalWithLate.toLocaleString("en-IN")}</p>\n              </div>\n            </div>\n          </div>\n        </div>',
    '              <div className="text-right">\n                <p className="text-xs text-muted-foreground">Total Paid</p>\n                <p className="font-bold text-success">₹{fee.paid_amount.toLocaleString("en-IN")} /\n                ₹{totalWithLate.toLocaleString("en-IN")}</p>\n              </div>\n            </div>\n          </div>\n          {fee.status !== "paid" && (\n            <div className="flex flex-col justify-end ml-0 md:ml-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 min-w-[120px]">\n               <Button onClick={() => handleSinglePay(fee.id)} disabled={isProcessing} className="w-full h-full min-h-[4rem] text-md gap-2" variant="default"><CreditCard className="w-5 h-5"/> Pay Now</Button>\n            </div>\n          )}\n        </div>'
);

fs.writeFileSync('src/pages/student/StudentFees.tsx', sfTsx, 'utf8');
