import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, calculateLateFee } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Receipt, Calendar, IndianRupee, Search } from "lucide-react";
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
      console.error(e);
      toast({ title: "Error fetching data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPay = async () => {
    if (selectedFees.length === 0) return;
    setIsProcessing(true);
    let successCount = 0;
    try {
      const feesToPay = myFees.filter(f => selectedFees.includes(f.id));
      for (const fee of feesToPay) {
        const lateFee = fee.status !== "paid" && fee.due_date ? calculateLateFee(fee.due_date) : 0;
        const totalWithLate = fee.amount + lateFee;
        const remaining = totalWithLate - fee.paid_amount;
        if (remaining <= 0) continue;

        const pRes = await supabase.from("student_payments").insert({
            student_id: studentUUID,
          fee_id: fee.id,
          amount: remaining,
          payment_method: "card",
          status: "success"
        });
        if (pRes.error) continue;

        const fRes = await supabase.from("student_fees").update({
          paid_amount: totalWithLate,
          status: "paid"
        }).eq("id", fee.id);
        
        if (!fRes.error) successCount++;
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
    const lateFee = f.status !== "paid" && f.due_date ? calculateLateFee(f.due_date) : 0;
    return acc + Math.max(0, (f.amount + lateFee) - f.paid_amount);
  }, 0), [myFees]);
  const totalPaid = useMemo(() => myFees.reduce((acc, f) => acc + f.paid_amount, 0), [myFees]);
  const nextDueDate = useMemo(() => {
    const unpaid = myFees.filter(f => f.status !== "paid" && f.due_date);
    if (!unpaid.length) return "N/A";
    return new Date(Math.min(...unpaid.map(f => new Date(f.due_date).getTime()))).toLocaleDateString();
  }, [myFees]);

  const toggleSelect = (id: string) => setSelectedFees(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const renderFeeCard = (fee: any) => {
    const isOverdue = fee.status !== "paid" && fee.due_date && new Date(fee.due_date) < new Date();
    const lateFee = fee.status !== "paid" && fee.due_date ? calculateLateFee(fee.due_date) : 0;
    const totalWithLate = fee.amount + lateFee;
    
    return (
      <div key={fee.id} className={cn("bg-card rounded-xl p-6 border shadow-card flex flex-col md:flex-row gap-4", isOverdue && "border-red-400 ring-1 ring-red-400")}>
        {fee.status !== "paid" && (
          <Checkbox checked={selectedFees.includes(fee.id)} onCheckedChange={() => toggleSelect(fee.id)} className="mt-1" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-lg">{fee.title || fee.semester}</h3>
            <Badge variant="outline" className={cn("capitalize", feeStatusStyles[fee.status])}>{fee.status}</Badge>
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
              <p className="font-bold text-success">₹{fee.paid_amount.toLocaleString("en-IN")} / ₹{totalWithLate.toLocaleString("en-IN")}</p>
            </div>
          </div>
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
                <p className="font-semibold">Payment on {new Date(p.created_at).toLocaleDateString()}</p>
                <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">Success</Badge>
              </div>
              <p className="font-bold text-success">+₹{p.amount.toLocaleString("en-IN")}</p>
            </div>
          )) : <div className="p-8 text-center border rounded bg-card">No history.</div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
