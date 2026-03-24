import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, calculateLateFee } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Receipt, Calendar, IndianRupee } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const feeStatusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-300",
  partial: "bg-amber-100 text-amber-800 border-amber-300",
  unpaid: "bg-red-100 text-red-800 border-red-300",
};

export default function StudentFees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myFees, setMyFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due_date_asc");

  // Bulk Payment
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customPayAmounts, setCustomPayAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const [studentUUID, setStudentUUID] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('hall_ticket_no', user?.id)
        .single();
        
      if (studentError || !studentData) throw new Error("Student record not found");
      const currentUUID = studentData.id;
      setStudentUUID(currentUUID);

      const [feesRes, paymentsRes] = await Promise.all([
        supabase.from("student_fees").select("*").eq("student_id", currentUUID),
        supabase.from("student_payments").select("*").eq("student_id", currentUUID).order("created_at", { ascending: false })
      ]);
      if (feesRes.error) throw feesRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      setMyFees(feesRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (e: any) {
      toast({ title: "Error fetching data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getLateFeeFor = (fee: any) => (fee.status !== "paid" && fee.due_date ? calculateLateFee(fee.due_date) : 0);

  const toCents = (value: number) => Math.round(Number(value || 0) * 100);
  const fromCents = (value: number) => Number((value / 100).toFixed(2));

  const getEffectivePaidFor = (fee: any, totalWithLate: number) => {
    const rawPaid = Number(fee.paid_amount || 0);
    const paidFromHistory = Number(totalSuccessfulAmountByFee?.[fee.id] || 0);
    const effectivePaid = Math.max(rawPaid, paidFromHistory);
    return Math.min(Math.max(effectivePaid, 0), totalWithLate);
  };

  const getRemainingFor = (fee: any, totalWithLate: number) => {
    const effectivePaid = getEffectivePaidFor(fee, totalWithLate);
    return Math.max(0, totalWithLate - effectivePaid);
  };

  const latestUnpaidMarkByFee = useMemo(() => {
    const unpaidMap: Record<string, any> = {};
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const payment of sortedPayments) {
      if (
        payment.status === "failed" &&
        payment.fee_id &&
        !unpaidMap[payment.fee_id]
      ) {
        unpaidMap[payment.fee_id] = payment;
      }
    }

    return unpaidMap;
  }, [payments]);

  const latestReverifyRequestByFee = useMemo(() => {
    const requestMap: Record<string, string> = {};
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (const payment of sortedPayments) {
      if (payment.status === "reverify_requested" && payment.fee_id && !requestMap[payment.fee_id]) {
        requestMap[payment.fee_id] = payment.created_at;
      }
    }

    return requestMap;
  }, [payments]);

  const totalSuccessfulAmountByFee = useMemo(() => {
    const amountMap: Record<string, number> = {};
    for (const payment of payments) {
      if (payment.status === "success" && payment.fee_id) {
        amountMap[payment.fee_id] = Number(
          ((amountMap[payment.fee_id] || 0) + Number(payment.amount || 0)).toFixed(2)
        );
      }
    }

    return amountMap;
  }, [payments]);

  const syncFeePaymentState = async (fee: any) => {
    const lateFee = getLateFeeFor(fee);
    const totalWithLate = Number(fee.amount || 0) + lateFee;

    const { data: successPayments, error: paymentsError } = await supabase
      .from("student_payments")
      .select("amount")
      .eq("student_id", studentUUID)
      .eq("fee_id", fee.id)
      .eq("status", "success");

    if (paymentsError) throw paymentsError;

    const totalPaidCents = (successPayments || []).reduce(
      (sum, payment) => sum + toCents(Number(payment.amount || 0)),
      0
    );
    const totalDueCents = toCents(totalWithLate);
    const normalizedPaidCents = Math.min(totalPaidCents, totalDueCents);

    const nextStatus =
      normalizedPaidCents <= 0
        ? "unpaid"
        : normalizedPaidCents >= totalDueCents
          ? "paid"
          : "partial";

    const { error: feeError } = await supabase
      .from("student_fees")
      .update({
        paid_amount: fromCents(normalizedPaidCents),
        status: nextStatus,
      })
      .eq("id", fee.id);

    if (feeError) throw feeError;
  };

  const generateReceiptNo = () => `RCPT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const insertStudentPayment = async (
    feeId: string,
    amount: number,
    options?: { status?: string; remarks?: string }
  ) => {
    const paymentStatus = options?.status ?? "success";
    const paymentRemarks = options?.remarks;

    const variants = [
      {
        student_id: studentUUID,
        fee_id: feeId,
        amount,
        payment_method: "online",
        status: paymentStatus,
        remarks: paymentRemarks,
        receipt_no: generateReceiptNo(),
      },
      {
        student_id: studentUUID,
        fee_id: feeId,
        amount,
        payment_method: "online",
        status: paymentStatus,
        receipt_no: generateReceiptNo(),
      },
      {
        student_id: studentUUID,
        fee_id: feeId,
        amount,
        payment_method: "online",
        receipt_no: generateReceiptNo(),
      },
      {
        student_id: studentUUID,
        fee_id: feeId,
        amount,
        payment_method: "online",
      },
      {
        student_id: studentUUID,
        fee_id: feeId,
        amount,
      },
    ];

    let lastError: any = null;

    for (const payload of variants) {
      const { error } = await supabase.from("student_payments").insert(payload);
      if (!error) return;

      lastError = error;
      const message = String(error.message || "").toLowerCase();
      const isColumnMismatch =
        message.includes("column") &&
        (message.includes("does not exist") || message.includes("schema cache"));

      if (!isColumnMismatch) {
        throw error;
      }
    }

    if (lastError) throw lastError;
  };

  const handleRequestReverify = async (fee: any) => {
    if (!studentUUID) {
      toast({ title: "Request Failed", description: "Student profile not loaded yet.", variant: "destructive" });
      return;
    }

    if (latestReverifyRequestByFee[fee.id]) {
      toast({ title: "Already requested", description: "Re-verification request is already sent for this fee." });
      return;
    }

    try {
      const reason = latestUnpaidMarkByFee[fee.id]?.remarks || "Marked unpaid by admin";
      
        // Sum currently successful payments PLUS the specific payment amount that the admin just recently marked as unpaid.
        // This avoids summing up random legitimate checkout failures from the past.
        const historicSuccess = totalSuccessfulAmountByFee[fee.id] ?? 0;
        const disputedAmount = Math.max(0, Number(latestUnpaidMarkByFee[fee.id]?.amount || 0));
        let verificationAmount = historicSuccess + disputedAmount;
        
        // If the admin did a generic zero-amount reversal but the user claims they paid, default to the full fee amount as the claim.
        if (verificationAmount <= 0) {
           verificationAmount = fee.amount;
        }

      await insertStudentPayment(fee.id, verificationAmount, {
        status: "reverify_requested",
        remarks: `Student requested re-verification for paid amount ₹${verificationAmount.toLocaleString("en-IN")}. Admin reason: ${reason}`,
      });

      toast({ title: "Re-verification requested", description: "Admin has been notified to verify this fee again." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleSinglePay = async (feeId: string, amountToPay?: number) => {
    if (!studentUUID) {
      toast({ title: "Payment Failed", description: "Student profile not loaded yet.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const fee = myFees.find((f) => f.id === feeId);
      if (!fee) return;

      const lateFee = getLateFeeFor(fee);
      const totalAmount = fee.amount + lateFee;
      const remainingAmount = getRemainingFor(fee, totalAmount);
      if (remainingAmount <= 0) {
        toast({ title: "Nothing to pay", description: "This fee is already settled." });
        return;
      }

      const desiredAmount = amountToPay ?? remainingAmount;
      const normalizedAmount = Number(desiredAmount);

      if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
        toast({ title: "Invalid amount", description: "Enter a valid amount to pay.", variant: "destructive" });
        return;
      }

      if (normalizedAmount > remainingAmount) {
        toast({
          title: "Invalid amount",
          description: `You can pay up to ₹${remainingAmount.toLocaleString("en-IN")}`,
          variant: "destructive",
        });
        return;
      }

      await insertStudentPayment(fee.id, normalizedAmount);

      await syncFeePaymentState(fee);

      toast({ title: "Payment Successful", description: "Your payment was processed successfully." });
      setCustomPayAmounts((prev) => ({ ...prev, [feeId]: "" }));
      fetchData();
    } catch (error: any) {
      toast({ title: "Payment Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const paidDisplayForFee = (fee: any) => {
    const lateFee = getLateFeeFor(fee);
    const totalWithLate = fee.amount + lateFee;
    return getEffectivePaidFor(fee, totalWithLate);
  };

  const getCustomAmountForFee = (feeId: string) => {
    const raw = customPayAmounts[feeId];
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleBulkPay = async () => {
    if (selectedFees.length === 0) return;
    if (!studentUUID) {
      toast({ title: "Payment Failed", description: "Student profile not loaded yet.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    try {
      const feesToPay = myFees.filter(f => selectedFees.includes(f.id));
      for (const fee of feesToPay) {
        const lateFee = getLateFeeFor(fee);
        const totalWithLate = fee.amount + lateFee;
        const remaining = getRemainingFor(fee, totalWithLate);
        if (remaining <= 0) continue;

        try {
          await insertStudentPayment(fee.id, remaining);
        } catch {
          continue;
        }

        try {
          await syncFeePaymentState(fee);
          successCount++;
        } catch {
          continue;
        }
      }
      toast({ title: `${successCount} fees paid successfully` });
      setSelectedFees([]);
      fetchData();
    } catch(e:any) {
      toast({ title: "Payment Error", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredAndSortedFees = useMemo(() => {
    let result = [...myFees];
    if (searchQuery) result = result.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.semester.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== "all") result = result.filter(f => f.status === statusFilter);
    result.sort((a, b) => {
      if (sortBy === "due_date_asc") return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (sortBy === "amount_desc") return b.amount - a.amount;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [myFees, searchQuery, statusFilter, sortBy]);

  const totalOutstanding = useMemo(() => myFees.reduce((acc, f) => {
    const lateFee = getLateFeeFor(f);
    const totalWithLate = f.amount + lateFee;
    return acc + getRemainingFor(f, totalWithLate);
  }, 0), [myFees]);
  const totalPaid = useMemo(() => myFees.reduce((acc, f) => {
    const lateFee = getLateFeeFor(f);
    const totalWithLate = f.amount + lateFee;
    return acc + getEffectivePaidFor(f, totalWithLate);
  }, 0), [myFees]);
  const nextDueDate = useMemo(() => {
    const unpaid = myFees.filter(f => {
      if (!f.due_date) return false;
      const lateFee = getLateFeeFor(f);
      const totalWithLate = f.amount + lateFee;
      return getRemainingFor(f, totalWithLate) > 0;
    });
    if (!unpaid.length) return "N/A";
    return new Date(Math.min(...unpaid.map(f => new Date(f.due_date).getTime()))).toLocaleDateString();
  }, [myFees]);

  const toggleSelect = (id: string) => setSelectedFees(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const renderFeeCard = (fee: any) => {
    const lateFee = getLateFeeFor(fee);
    const totalWithLate = fee.amount + lateFee;
    const paidDisplay = getEffectivePaidFor(fee, totalWithLate);
    const remainingAmount = getRemainingFor(fee, totalWithLate);
    
    // Derive visual status based on actual payments
    let derivedStatus = fee.status;
    if (paidDisplay >= totalWithLate) {
      derivedStatus = "paid";
    } else if (paidDisplay > 0 && derivedStatus === "unpaid") {
      derivedStatus = "partial";
    }

    const isOverdue = derivedStatus !== "paid" && fee.due_date && new Date(fee.due_date) < new Date();


    const unpaidMark = latestUnpaidMarkByFee[fee.id];
    const unpaidReason = unpaidMark?.remarks || "No reason provided by admin.";
    const reverifyRequestedAt = latestReverifyRequestByFee[fee.id];
    const customAmount = getCustomAmountForFee(fee.id);
    const isCustomInvalid = customAmount <= 0 || customAmount > remainingAmount;
    
    return (
      <div key={fee.id} className={cn("bg-card rounded-xl p-6 border shadow-card flex flex-col md:flex-row gap-4", isOverdue && "border-red-400 ring-1 ring-red-400")}>
        {derivedStatus !== "paid" && (
          <Checkbox checked={selectedFees.includes(fee.id)} onCheckedChange={() => toggleSelect(fee.id)} className="mt-1" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-lg">{fee.title || fee.semester}</h3>
            <Badge variant="outline" className={cn("capitalize", feeStatusStyles[derivedStatus] || feeStatusStyles.unpaid)}>{derivedStatus}</Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-between mb-4">
            <span>Due: {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "-"}</span>
            {isOverdue && <span className="text-red-600 font-semibold text-xs">Overdue!</span>}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Original Amount</p>
              <p className="font-bold">₹{fee.amount.toLocaleString("en-IN")}</p>
            </div>
            {lateFee > 0 && (
              <div className="text-center">
                <p className="text-xs text-red-500 font-semibold">Late Fee</p>
                <p className="font-bold text-red-600">+₹{lateFee.toLocaleString("en-IN")}</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="font-bold text-success">₹{paidDisplay.toLocaleString("en-IN")} / ₹{totalWithLate.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {fee.status === "unpaid" && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <p className="font-semibold">Marked unpaid by admin</p>
              <p>{unpaidReason}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recent unpaid transaction: {unpaidMark?.receipt_no || "-"} • {unpaidMark?.created_at ? new Date(unpaidMark.created_at).toLocaleString() : "-"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequestReverify(fee)}
                  disabled={isProcessing || !!reverifyRequestedAt}
                >
                  {reverifyRequestedAt ? "Re-verification Requested" : "Request Re-verify"}
                </Button>
                {reverifyRequestedAt && (
                  <span className="text-xs text-muted-foreground">
                    Requested on {new Date(reverifyRequestedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {derivedStatus !== "paid" && (
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-end">
              <div className="w-full md:w-52 space-y-1">
                <p className="text-xs text-muted-foreground">Custom Amount</p>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={remainingAmount}
                  placeholder={`Up to ₹${remainingAmount.toLocaleString("en-IN")}`}
                  value={customPayAmounts[fee.id] ?? ""}
                  onChange={(e) => {
                    setCustomPayAmounts((prev) => ({
                      ...prev,
                      [fee.id]: e.target.value,
                    }));
                  }}
                  disabled={isProcessing || remainingAmount <= 0}
                />
              </div>

              <Button
                onClick={() => handleSinglePay(fee.id)}
                disabled={isProcessing || remainingAmount <= 0}
                variant="outline"
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Full ₹{remainingAmount.toLocaleString("en-IN")}
              </Button>

              <Button
                onClick={() => handleSinglePay(fee.id, customAmount)}
                disabled={isProcessing || remainingAmount <= 0 || isCustomInvalid}
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Custom
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading fees...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">My Fees & Payments</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard title="Total Outstanding" value={"₹" + totalOutstanding.toLocaleString("en-IN")} icon={IndianRupee} variant={totalOutstanding > 0 ? "accent" : "default"} />
        <StatCard title="Total Paid" value={"₹" + totalPaid.toLocaleString("en-IN")} icon={Receipt} variant="secondary" />
        <StatCard title="Next Due Date" value={nextDueDate} icon={Calendar} variant="primary" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Dues</TabsTrigger>
            <TabsTrigger value="semester">Semester Fees</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 items-center">
            <Input placeholder="Search fees..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-[180px]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedFees.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex justify-between items-center">
            <p className="font-semibold">{selectedFees.length} fees selected</p>
            <Button onClick={handleBulkPay} disabled={isProcessing} className="gap-2"><CreditCard className="w-4 h-4" /> Pay Selected</Button>
          </div>
        )}

        <TabsContent value="all" className="space-y-4">{filteredAndSortedFees.length ? filteredAndSortedFees.map(renderFeeCard) : <div className="p-8 text-center border rounded">No records.</div>}</TabsContent>
        <TabsContent value="semester" className="space-y-4">{filteredAndSortedFees.filter(f=>f.fee_type==="semester").length ? filteredAndSortedFees.filter(f=>f.fee_type==="semester").map(renderFeeCard) : <div className="p-8 text-center border rounded">No semester records.</div>}</TabsContent>
        <TabsContent value="history" className="space-y-4">
          {payments.length ? payments.map(p => (
            <div key={p.id} className="p-4 border rounded flex justify-between items-center bg-card">
              <div>
                <p className="font-semibold">
                  {p.status === "failed" && Number(p.amount || 0) === 0
                    ? `Admin marked unpaid on ${new Date(p.created_at).toLocaleDateString()}`
                    : p.status === "reverify_requested"
                    ? `Re-verification request on ${new Date(p.created_at).toLocaleDateString()}`
                    : `Payment on ${new Date(p.created_at).toLocaleDateString()}`}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1",
                    p.status === "failed"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : p.status === "reverify_requested"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  {p.status === "failed"
                    ? (Number(p.amount || 0) === 0 && latestUnpaidMarkByFee[p.fee_id]?.id === p.id ? "Marked Unpaid (Latest)" : "Marked Unpaid")
                    : p.status === "reverify_requested"
                      ? "Re-verify Requested"
                      : "Success"}
                </Badge>
                {(p.status === "failed" || p.status === "reverify_requested") && p.remarks && (
                  <p className="text-xs text-destructive mt-1">Reason: {p.remarks}</p>
                )}
              </div>
              {p.status === "failed" && Number(p.amount || 0) === 0 ? (
                <p className="font-bold text-destructive">Marked unpaid by admin</p>
              ) : (
                <p className={cn("font-bold", p.status === "failed" ? "text-muted-foreground line-through" : p.status === "reverify_requested" ? "text-amber-700" : "text-success")}>
                  {p.status === "failed" ? "-" : p.status === "reverify_requested" ? "" : "+"}₹{Number(p.amount || 0).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )) : <div className="p-8 text-center border rounded bg-card">No history.</div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
