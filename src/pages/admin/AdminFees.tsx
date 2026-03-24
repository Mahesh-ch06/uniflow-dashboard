import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { cn, calculateLateFee } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, IndianRupee, CreditCard, Users, Trash2, MoreHorizontal, CheckCircle, Clock, Check, ChevronsUpDown, AlertCircle, XCircle, Edit, Bell, FileText, Download, Receipt, Search } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const feeStatusStyles = {
  paid: "bg-success/10 text-success border-success/30",
  partial: "bg-warning/10 text-warning border-warning/30",
  unpaid: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function AdminFees() {
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  
  // New States
  const [studentHistoryDialog, setStudentHistoryDialog] = useState<any>(null); // To store history for specific student
  const [studentTransactions, setStudentTransactions] = useState<any[]>([]);
  
  // Reverse Payment States
  const [reverseDialog, setReverseDialog] = useState<any>(null);
  const [reversePaymentId, setReversePaymentId] = useState<string>('none');
  const [reverseReason, setReverseReason] = useState<string>('');
  const [isReversing, setIsReversing] = useState(false);

  const { toast } = useToast();

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Bulk Selection State
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Edit Fee Dialog
  const [editFeeDialog, setEditFeeDialog] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    amount: "",
    due_date: "",
    fee_type: "semester",
  });

  const [bulkForm, setBulkForm] = useState({
    title: "",
    description: "",
    amount: "",
    due_date: "",
    target: "all",
    department: "",
    hall_ticket_no: "",
    fee_type: "semester",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchFees(), fetchAllStudents(), fetchPayments()]);
    setLoading(false);
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_payments')
        .select(`*, students:student_id(name, hall_ticket_no), student_fees:fee_id(title, fee_type)`)
        .order('created_at', { ascending: false });
      if (error && error.code !== '42P01') throw error;
      if (data) {
        setPayments(data.map(p => ({
          ...p,
          studentName: p.students?.name,
          hall_ticket_no: p.students?.hall_ticket_no,
          feeTitle: p.student_fees?.title,
          feeType: p.student_fees?.fee_type
        })));
      }
    } catch {}
  };

  const fetchAllStudents = async () => {
    try {
      const { data, error } = await supabase.from('students').select('id, name, hall_ticket_no, department');
      if (error) throw error;
      setAllStudents(data || []);
    } catch {}
  };

  const fetchFees = async () => {
    try {
      const { data, error } = await supabase
        .from('student_fees')
        .select(`
          *,
          students:student_id (
            name,
            department,
            hall_ticket_no
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(fee => {
        let paid = Number(fee.paid_amount || 0);
        const total = Number(fee.amount || 0);
        
        // Correct inconsistencies for legacy records
        if (fee.status === 'unpaid') paid = 0;
        if (fee.status === 'paid' && paid < total) paid = total;

        return {
          ...fee,
          paid_amount: paid,
          studentName: fee.students ? fee.students.name : 'Unknown',
          hall_ticket_no: fee.students?.hall_ticket_no || 'N/A',
          department: fee.students?.department || 'N/A'
        };
      }) || [];

      setFees(formattedData);
    } catch (error: any) {
      toast({
        title: "Error fetching fees",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openStudentTransactions = (studentInfo: any) => {
    // Filter payments state for this specific student's ID or hall ticket
    const txs = payments.filter(p => p.student_id === studentInfo.student_id || p.hall_ticket_no === studentInfo.hall_ticket_no);
    setStudentTransactions(txs);
    setStudentHistoryDialog(studentInfo);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bulkForm.title || !bulkForm.amount) {
        throw new Error("Title and amount are required");
      }

      let query = supabase.from('students').select('id');
      if (bulkForm.target === 'department' && bulkForm.department) {
        query = query.eq('department', bulkForm.department);
      } else if (bulkForm.target === 'individual') {
        if (!bulkForm.hall_ticket_no) throw new Error("Select a student first");
        query = query.eq('hall_ticket_no', bulkForm.hall_ticket_no);
      }
      
      const { data: students, error: studentError } = await query;
      if (studentError) throw studentError;

      if (!students || students.length === 0) {
        throw new Error(bulkForm.target === 'individual' ? "Student not found" : "No students found for this target");
      }

      const feesToInsert = students.map((student) => ({
        student_id: student.id,
        title: bulkForm.title,
        description: bulkForm.description,
        amount: parseFloat(bulkForm.amount),
        due_date: bulkForm.due_date || null,
        fee_type: bulkForm.fee_type,
        status: 'unpaid'
      }));

      const { error: insertError } = await supabase
        .from('student_fees')
        .insert(feesToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Assigned fee to " + students.length + " students.",
      });
      setIsBulkOpen(false);
      fetchFees();

    } catch (error: any) {
      toast({
        title: "Bulk Assignment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // If marking as paid, assume full amount is paid
      let paid_amount = undefined;
      const statusObj: any = { status };
      
      if (status === 'paid') {
        const fee = fees.find(f => f.id === id);
        if (fee) {
          statusObj.paid_amount = Number(fee.amount);
        }
      } else if (status === 'unpaid') {
        // Simple unpaid mark (legacy flow) - we'll keep this for simple zero-paid items
        statusObj.paid_amount = 0;
      }

      const { error } = await supabase
        .from('student_fees')
        .update(statusObj)
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Fee status updated" });
      fetchFees();
    } catch (error: any) {
      toast({ title: "Error updating", description: error.message, variant: "destructive" });
    }
  };

  const handleReversePayment = async () => {
    if (!reverseDialog) return;
    setIsReversing(true);
    try {
      if (!reverseReason.trim()) {
        throw new Error("Reason is required when marking unpaid or reversing payment");
      }

      let newPaidAmount = Number(reverseDialog.paid_amount || 0);

      // If a specific payment is being reversed
      if (reversePaymentId && reversePaymentId !== 'none') {
        const paymentToReverse = payments.find(p => p.id === reversePaymentId);
        if (paymentToReverse) {
          // Update the payment record
          const { error: paymentError } = await supabase
            .from('student_payments')
            .update({ status: 'failed', remarks: reverseReason || "Reversed by admin" })
            .eq('id', reversePaymentId);
          
          if (paymentError) throw paymentError;
          newPaidAmount -= Number(paymentToReverse.amount);
        }
      } else {
        const reversalReceiptNo = `REV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const { error: logReasonError } = await supabase
          .from('student_payments')
          .insert({
            student_id: reverseDialog.student_id,
            fee_id: reverseDialog.id,
            amount: 0,
            payment_method: 'online',
            status: 'failed',
            receipt_no: reversalReceiptNo,
            remarks: reverseReason.trim(),
          });

        if (logReasonError) throw logReasonError;

        newPaidAmount = 0;
      }

      newPaidAmount = Math.max(0, newPaidAmount); // Avoid negatives
      const totalAmount = Number(reverseDialog.amount || 0);
      const newStatus = newPaidAmount === 0 ? 'unpaid' : (newPaidAmount >= totalAmount ? 'paid' : 'partial');

      const { error: feeError } = await supabase
        .from('student_fees')
        .update({ paid_amount: newPaidAmount, status: newStatus })
        .eq('id', reverseDialog.id);

      if (feeError) throw feeError;

      toast({ title: reversePaymentId !== 'none' ? "Payment reversed successfully" : "Fee marked as unpaid" });
      setReverseDialog(null);
      setReverseReason('');
      setReversePaymentId('none');
      fetchData(); // fetch both fees and payments
    } catch (error: any) {
      toast({ title: "Error reversing payment", description: error.message, variant: "destructive" });
    } finally {
      setIsReversing(false);
    }
  };

  const handleResolveReverifyRequest = async (payment: any, approve: boolean) => {
    try {
      const { data: feeRecord, error: feeFetchError } = await supabase
        .from('student_fees')
        .select('id, amount, due_date, student_id')
        .eq('id', payment.fee_id)
        .single();

      if (feeFetchError || !feeRecord) throw feeFetchError || new Error('Fee record not found');

      if (approve) {
        const lateFee = feeRecord.due_date ? calculateLateFee(String(feeRecord.due_date)) : 0;
        const totalWithLate = Number(feeRecord.amount || 0) + lateFee;

        // Instead of purely relying on current "success" payments which might have been marked failed,
        // we use the amount the student requested in the reverify claim (which restores previously valid amounts).
        const claimedAmount = Math.max(0, Number(payment.amount || 0));
        const normalizedDue = Number(totalWithLate.toFixed(2));
        
        let nextStatus = 'partial';
        if (claimedAmount <= 0) nextStatus = 'unpaid';
        if (claimedAmount >= normalizedDue) nextStatus = 'paid';

        const { error: feeUpdateError } = await supabase
          .from('student_fees')
          .update({ status: nextStatus, paid_amount: claimedAmount })
          .eq('id', payment.fee_id);

        if (feeUpdateError) throw feeUpdateError;
      }

      const { error: paymentUpdateError } = await supabase
        .from('student_payments')
        .update({
          status: approve ? 'reverify_approved' : 'reverify_rejected',
          remarks: approve
            ? `Re-verification approved by admin. Fee restored to ₹${Number(payment.amount || 0).toLocaleString("en-IN")}.`
            : 'Re-verification reviewed by admin. Unpaid status retained.',
        })
        .eq('id', payment.id);

      if (paymentUpdateError) throw paymentUpdateError;

      toast({ title: approve ? 'Re-verification approved' : 'Re-verification rejected' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Unable to review request', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fee record?")) return;
    try {
      const { error } = await supabase
        .from('student_fees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Fee record deleted" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error deleting", description: error.message, variant: "destructive" });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFeeDialog) return;
    try {
      const { error } = await supabase
        .from('student_fees')
        .update({
          title: editForm.title,
          description: editForm.description,
          amount: parseFloat(editForm.amount),
          due_date: editForm.due_date || null,
          fee_type: editForm.fee_type,
        })
        .eq('id', editFeeDialog.id);

      if (error) throw error;
      toast({ title: "Fee updated correctly" });
      setEditFeeDialog(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error updating fee", description: error.message, variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedFees.length) return;
    if (!confirm(`Are you sure you want to delete ${selectedFees.length} fee records?`)) return;
    
    setIsBulkProcessing(true);
    try {
      const { error } = await supabase
        .from('student_fees')
        .delete()
        .in('id', selectedFees);

      if (error) throw error;
      toast({ title: `${selectedFees.length} records deleted` });
      setSelectedFees([]);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error during bulk delete", description: error.message, variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkMarkPaid = async () => {
    if (!selectedFees.length) return;
    if (!confirm(`Mark ${selectedFees.length} fee records as paid?`)) return;
    
    setIsBulkProcessing(true);
    try {
      // First fetch the amounts so we can mark exact paid_amount
      const recordsToUpdate = fees.filter(f => selectedFees.includes(f.id));
      
      // Basic update just to status paid for all selected. 
      // Supabase .update() with .in() applies same payload to all.
      // For accurate paid_amount, we might individually promise.all them if amounts differ, 
      // but if we just rely on existing logic (if status='paid' => full amount), we can just set status.
      // Wait, we need to set paid_amount matching each amount. Let's do Promise.all
      const updatePromises = recordsToUpdate.map(fee => 
        supabase.from('student_fees').update({ 
          status: 'paid', 
          paid_amount: Number(fee.amount) 
        }).eq('id', fee.id)
      );
      
      await Promise.all(updatePromises);
      
      toast({ title: `${selectedFees.length} records marked as paid` });
      setSelectedFees([]);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const totalAmount = fees.reduce((sum, f) => {
    const base = Number(f.amount || 0);
    const late = f.status !== 'paid' && f.due_date ? calculateLateFee(String(f.due_date)) : 0;
    return sum + base + late;
  }, 0);
  const collectedAmount = fees.reduce((sum, f) => {
    let paid = Number(f.paid_amount || 0);
    const base = Number(f.amount || 0);
    const late = f.status !== 'paid' && f.due_date ? calculateLateFee(String(f.due_date)) : 0;
    const total = base + late;
    if (f.status === 'unpaid') paid = 0;
    if (f.status === 'paid' && paid < total) paid = total;
    return sum + paid;
  }, 0);
  const pendingAmount = fees.reduce((sum, f) => {
    let paid = Number(f.paid_amount || 0);
    const base = Number(f.amount || 0);
    const late = f.status !== 'paid' && f.due_date ? calculateLateFee(String(f.due_date)) : 0;
    const total = base + late;
    if (f.status === 'unpaid') paid = 0;
    if (f.status === 'paid' && paid < total) paid = total;
    return sum + Math.max(0, total - paid);
  }, 0);
  const distinctStudents = new Set(fees.map(f => f.student_id)).size;

  const exportToCSV = (type: 'fees' | 'payments') => {
    const data = type === 'fees' ? fees : payments;
    if (!data.length) return toast({title: 'No Data', description: 'There is no data to export.'});
    
    const content = data.map(item => {
      if (type === 'fees') {
        return {'Title': item.title, 'Student': item.studentName, 'Hall Ticket': item.hall_ticket_no, 'Total': item.amount, 'Paid': item.paid_amount || 0, 'Status': item.status, 'Due Date': item.due_date};
      } else {
        return {'Receipt': item.receipt_no, 'Student': item.studentName, 'Hall Ticket': item.hall_ticket_no, 'Fee': item.feeTitle, 'Amount': item.amount, 'Status': item.status || 'success', 'Date': item.created_at, 'Remarks': item.remarks || ''};
      }
    });

    const headers = Object.keys(content[0]);
    const csvStr = [
      headers.join(','),
      ...content.map(row => headers.map(h => `"${(row as any)[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_export_${new Date().getTime()}.csv`;
    link.click();
  };

  const feeColumns = [
    {
      header: "Student",
      accessor: (row: any) => (
         <div 
           className="cursor-pointer group flex flex-col items-start"
           onClick={() => openStudentTransactions(row)}
         >
           <span className="font-semibold group-hover:text-primary transition-colors hover:underline">
             {row.studentName}
           </span>
           <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary/70">
             {row.hall_ticket_no}
           </span>
         </div>
      ),
    },
    { header: "Fee Title", accessor: "title" },
    {
      header: "Amount",
      accessor: (row: any) => {
        const lateFee = row.status !== 'paid' && row.due_date ? calculateLateFee(String(row.due_date)) : 0;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              ₹{Number(row.amount || 0).toLocaleString('en-IN')}
            </span>
            {lateFee > 0 && <span className="text-xs text-red-500 font-medium">+₹{lateFee.toLocaleString('en-IN')} late fee</span>}
          </div>
        );
      },
    },
    {
      header: "Paid",
      accessor: (row: any) => (
        <span className="font-medium text-emerald-600">
          ₹{Number(row.paid_amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <Badge variant="outline" className={cn("capitalize", feeStatusStyles[row.status as keyof typeof feeStatusStyles])}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Date Assigned",
      accessor: (row: any) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openStudentTransactions(row)} className="cursor-pointer gap-2">
              <Search className="h-4 w-4 text-muted-foreground" /> View Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(row.id, 'paid')} className="text-success cursor-pointer">
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(row.id, 'unpaid')} className="text-destructive cursor-pointer">
              Mark as Unpaid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteFee(row.id)} className="text-destructive cursor-pointer mt-2 border-t">
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const paymentColumns = [
    { header: "Receipt No", accessor: "receipt_no" },
    { header: "Student", accessor: (row:any) => `${row.studentName} (${row.hall_ticket_no})` },
    { header: "Fee Context", accessor: "feeTitle" },
    { header: "Amount", accessor: (row: any) => <span className={cn("font-semibold", row.status === 'failed' ? "text-muted-foreground line-through" : "text-emerald-600")}>₹{Number(row.amount).toLocaleString('en-IN')}</span> },
    { header: "Date", accessor: (row: any) => new Date(row.created_at).toLocaleString('en-IN') },
    {
      header: "Status",
      accessor: (row: any) => (
         <Badge variant="outline" className={cn("capitalize px-2", row.status === 'failed' ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200")}>
           {row.status === 'failed' ? <XCircle className="w-3 h-3 mr-1 inline" /> : <CheckCircle className="w-3 h-3 mr-1 inline" />}
           {row.status || 'success'}
         </Badge>
      )
    }
  ];

  const filteredFees = fees.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (filterType !== 'all' && f.fee_type !== filterType) return false;
    return true;
  });

  if (loading) return <div className="p-8 flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground">Track and manage student fee records</p>
        </div>
        
        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Assign Bulk Fees
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleBulkSubmit}>
              <DialogHeader>
                <DialogTitle>Assign Bulk Fees</DialogTitle>
                <DialogDescription>
                  Assign semester fees, exam fees, or fines to multiple students at once.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fee_type">Fee Type</Label>
                    <Select value={bulkForm.fee_type} onValueChange={(val) => setBulkForm({...bulkForm, fee_type: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semester">Semester Fee</SelectItem>
                        <SelectItem value="exam">Exam Fee</SelectItem>
                        <SelectItem value="fine">Fine</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target">Target Students</Label>
                    <Select value={bulkForm.target} onValueChange={(val) => setBulkForm({...bulkForm, target: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="department">By Department</SelectItem>
                        <SelectItem value="individual">Individual Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {bulkForm.target === 'department' && (
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      placeholder="e.g. Computer Science" 
                      value={bulkForm.department}
                      onChange={(e) => setBulkForm({...bulkForm, department: e.target.value})}
                    />
                  </div>
                )}

                {bulkForm.target === 'individual' && (
                  <div className="grid gap-2">
                    <Label>Search & Select Student</Label>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="justify-between bg-background font-normal"
                        >
                          {bulkForm.hall_ticket_no
                            ? (() => {
                                const selected = allStudents.find((s) => s.hall_ticket_no === bulkForm.hall_ticket_no);
                                return selected ? `${selected.hall_ticket_no} - ${selected.name}` : "Unknown Student";
                              })()
                            : "Search by name or hall ticket..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 sm:max-w-[460px] w-full" align="start">
                        <Command>
                          <CommandInput placeholder="Search student..." />
                          <CommandList>
                            <CommandEmpty>No student found.</CommandEmpty>
                            <CommandGroup>
                              {allStudents.map((student) => (
                                <CommandItem
                                  key={student.id}
                                  value={`${student.hall_ticket_no} ${student.name}`}
                                  onSelect={() => {
                                    setBulkForm({ ...bulkForm, hall_ticket_no: student.hall_ticket_no });
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      bulkForm.hall_ticket_no === student.hall_ticket_no ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {student.hall_ticket_no} - {student.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="title">Fee Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Fall 2024 Semester Fee" 
                    value={bulkForm.title}
                    onChange={(e) => setBulkForm({...bulkForm, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 1500" 
                      value={bulkForm.amount}
                      onChange={(e) => setBulkForm({...bulkForm, amount: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input 
                      id="due_date" 
                      type="date"
                      value={bulkForm.due_date}
                      onChange={(e) => setBulkForm({...bulkForm, due_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Additional details..."
                    value={bulkForm.description}
                    onChange={(e) => setBulkForm({...bulkForm, description: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Assign Fees</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Expected" 
          value={"₹" + totalAmount.toLocaleString('en-IN')} 
          icon={IndianRupee} 
        />
        <StatCard 
          title="Total Collected" 
          value={"₹" + collectedAmount.toLocaleString('en-IN')} 
          icon={CheckCircle} 
          variant="secondary" 
        />
        <StatCard 
          title="Pending Dues" 
          value={"₹" + pendingAmount.toLocaleString('en-IN')} 
          icon={Clock} 
          variant="accent" 
        />
        <StatCard 
          title="Students with Fees" 
          value={distinctStudents} 
          icon={Users} 
          variant="primary" 
        />
      </div>

      <Tabs defaultValue="fees" className="w-full mt-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="fees">All Issued Fees</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>
          
          <div className="hidden sm:block">
            <TabsContent value="fees" className="mt-0">
               <Button variant="outline" size="sm" onClick={() => exportToCSV('fees')} className="gap-2"><Download className="h-4 w-4"/> Export CSV</Button>
            </TabsContent>
            <TabsContent value="transactions" className="mt-0">
               <Button variant="outline" size="sm" onClick={() => exportToCSV('payments')} className="gap-2"><Download className="h-4 w-4"/> Export CSV</Button>
            </TabsContent>
          </div>
        </div>

        <TabsContent value="fees" className="space-y-4">
          <div className="bg-card rounded-xl border shadow-sm p-2 sm:p-4">
            
            {/* Filters & Bulk Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="fine">Fine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedFees.length > 0 && (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border text-sm animate-in fade-in slide-in-from-bottom-2">
                  <span className="font-medium mr-2">{selectedFees.length} selected</span>
                  <Button variant="outline" size="sm" onClick={handleBulkMarkPaid} disabled={isBulkProcessing} className="h-8 gap-1.5 text-success hover:bg-success/10 border-success/20">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Mark Paid
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} disabled={isBulkProcessing} className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/20">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <DataTable
              data={filteredFees as unknown as Record<string, unknown>[]}
              searchKeys={["studentName", "hall_ticket_no", "title"]}
              searchPlaceholder="Search by student, hall ticket, or fee title..."
              enableRowSelection={true}
              selectedRows={selectedFees}
              onRowSelectionChange={setSelectedFees}
              columns={[
                { key: "hall_ticket_no", label: "Hall Ticket" },
                { key: "studentName", label: "Student", render: (item) => (
                   <div onClick={() => openStudentTransactions(item)} className="cursor-pointer text-primary hover:underline flex items-center gap-1 font-medium">
                     {String(item.studentName)}
                   </div>
                ) },
                { key: "department", label: "Department" },
                { key: "title", label: "Fee Title" },
                { key: "fee_type", label: "Type", render: (item) => <span className="capitalize">{String(item.fee_type)}</span> },
                { key: "amount", label: "Amount", render: (item) => { 
                  const lateFee = item.status !== 'paid' && item.due_date ? calculateLateFee(String(item.due_date)) : 0; 
                  return ( 
                    <div className="flex flex-col"> 
                      <span>₹{Number(item.amount).toLocaleString('en-IN')}</span> 
                      {lateFee > 0 && <span className="text-xs text-red-500 font-medium">+₹{lateFee.toLocaleString('en-IN')} late</span>}
                    </div>
                  ); 
                }},
                { key: "due_date", label: "Due Date", render: (item) => item.due_date ? new Date(String(item.due_date)).toLocaleDateString() : "-" },
                { key: "status", label: "Status", render: (item) => (
                  <Badge variant="outline" className={cn("capitalize", feeStatusStyles[(item.status as keyof typeof feeStatusStyles) || 'unpaid'])}>
                    {String(item.status)}
                  </Badge>
                )},
                { key: "actions", label: "", render: (item) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openStudentTransactions(item)} className="cursor-pointer">
                        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                        View Transactions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setEditFeeDialog(item);
                        setEditForm({
                          title: String(item.title || ''),
                          description: String(item.description || ''),
                          amount: String(item.amount || ''),
                          due_date: item.due_date ? String(item.due_date) : '',
                          fee_type: String(item.fee_type || 'semester'),
                        });
                      }} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-primary" />
                        Edit Details
                      </DropdownMenuItem>
                      {item.status !== 'paid' && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(item.id as string, 'paid')} className="cursor-pointer">
                          <CheckCircle className="mr-2 h-4 w-4 text-success" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {item.status !== 'unpaid' && (
                          <DropdownMenuItem onClick={() => setReverseDialog(item)} className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4 text-destructive" />
                            Mark Unpaid / Reverse
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => handleDeleteFee(item.id as string)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Fee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="bg-card rounded-xl border shadow-sm p-2 sm:p-4">
            <DataTable
              data={payments as unknown as Record<string, unknown>[]}
              searchKeys={["studentName", "hall_ticket_no", "receipt_no", "feeTitle"]}
              searchPlaceholder="Search by student, receipt, or title..."
              columns={[
                { key: "receipt_no", label: "Receipt No" },
                { key: "studentName", label: "Student", render: (item) => (
                   <div onClick={() => openStudentTransactions(item)} className="cursor-pointer text-primary hover:underline flex items-center gap-1 font-medium">
                     {String(item.studentName)}
                   </div>
                )},
                { key: "hall_ticket_no", label: "Hall Ticket" },
                { key: "feeTitle", label: "Fee Context" },
                { key: "amount", label: "Amount", render: (item) => <span className={cn("font-semibold", item.status === 'failed' ? "text-muted-foreground line-through" : "text-emerald-600")}>₹{Number(item.amount).toLocaleString('en-IN')}</span> },
                { key: "created_at", label: "Date", render: (item) => new Date(String(item.created_at)).toLocaleString('en-IN') },
                { key: "status", label: "Status", render: (item) => (
                  <Badge variant="outline" className={cn(
                    "capitalize px-2",
                    item.status === 'failed'
                      ? "bg-red-50 text-red-600 border-red-200"
                      : item.status === 'reverify_requested'
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  )}>
                     {item.status === 'failed'
                       ? <XCircle className="w-3 h-3 mr-1 inline" />
                       : item.status === 'reverify_requested'
                         ? <Clock className="w-3 h-3 mr-1 inline" />
                         : <CheckCircle className="w-3 h-3 mr-1 inline" />}
                     {String(item.status || 'success')}
                  </Badge>
                )},
                { key: "actions", label: "", render: (item) => (
                  item.status === 'reverify_requested' ? (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleResolveReverifyRequest(item, false)}>
                        Keep Unpaid
                      </Button>
                      <Button size="sm" onClick={() => handleResolveReverifyRequest(item, true)}>
                        Approve & Mark Paid
                      </Button>
                    </div>
                  ) : null
                )}
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!studentHistoryDialog} onOpenChange={(open) => !open && setStudentHistoryDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-full p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> 
              Transaction History
            </DialogTitle>
            <DialogDescription>
              Viewing all payment records for <span className="font-semibold text-foreground">{studentHistoryDialog?.studentName}</span> ({studentHistoryDialog?.hall_ticket_no})
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 space-y-4 w-full">
            {studentTransactions.length > 0 ? (
              <div className="border rounded-md w-full text-sm">
                <div className="bg-muted p-3 grid grid-cols-4 font-semibold text-muted-foreground w-full border-b">
                  <div>Date</div>
                  <div>Details</div>
                  <div>Amount</div>
                  <div className="text-right">Status</div>
                </div>
                {studentTransactions.map(ctx => (
                  <div key={ctx.id} className="p-3 grid grid-cols-4 items-center gap-2 border-b last:border-0 hover:bg-muted/50 transition-colors w-full">
                    <div className="text-muted-foreground text-xs">
                      {new Date(ctx.created_at).toLocaleDateString('en-IN')}<br/>
                      <span>{new Date(ctx.created_at).toLocaleTimeString('en-IN', {minute:'2-digit', hour:'2-digit'})}</span>
                    </div>
                    <div>
                      <p className="font-medium">{ctx.receipt_no}</p>
                      <p className="text-xs text-muted-foreground truncate" title={ctx.feeTitle}>{ctx.feeTitle}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${ctx.status === 'failed' ? 'line-through text-muted-foreground' : 'text-emerald-600'}`}>
                        ₹{Number(ctx.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      {ctx.status === 'failed' ? (
                        <div className="flex flex-col items-end">
                           <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200">Failed</Badge>
                        </div>
                      ) : (
                         <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">Success</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="p-8 text-center bg-muted/20 border border-dashed rounded-xl">
                 <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                 <p className="text-foreground font-medium">No transactions found</p>
                 <p className="text-sm text-muted-foreground">This student hasn't made any successful or failed payments yet.</p>
               </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setStudentHistoryDialog(null)} className="w-full sm:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Reverse Payment Dialog */}
        <Dialog open={!!reverseDialog} onOpenChange={(open) => {
          if (!open) {
            setReverseDialog(null);
            setReverseReason('');
            setReversePaymentId('none');
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Unpaid / Reverse Payment</DialogTitle>
              <DialogDescription>
                Reverse payments for {reverseDialog?.studentName} - {reverseDialog?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Transaction to Reverse (Optional)</Label>
                <Select value={reversePaymentId} onValueChange={setReversePaymentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a transaction..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific transaction (Just mark unpaid)</SelectItem>
                    {payments
                      .filter(p => p.fee_id === reverseDialog?.id && p.status !== 'failed')
                      .map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.receipt_no} - ₹{Number(p.amount).toLocaleString('en-IN')} ({new Date(p.created_at).toLocaleDateString()})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reason for Reversal / Unpaid Mark</Label>
                <Input 
                  placeholder="e.g., Bounced check, incorrect amount..." 
                  value={reverseReason} 
                  onChange={(e) => setReverseReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This reason will be shown to the student.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReverseDialog(null)} disabled={isReversing}>Cancel</Button>
              <Button variant="destructive" onClick={handleReversePayment} disabled={isReversing || !reverseReason.trim()}>
                {isReversing ? "Processing..." : "Confirm Reversal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Fee Dialog */}
        <Dialog open={!!editFeeDialog} onOpenChange={(open) => !open && setEditFeeDialog(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Fee Details</DialogTitle>
                <DialogDescription>
                  Update the information for this fee record. Existing student connections stay the same.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_fee_type">Fee Type</Label>
                  <Select value={editForm.fee_type} onValueChange={(val) => setEditForm({...editForm, fee_type: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Semester Fee</SelectItem>
                      <SelectItem value="exam">Exam Fee</SelectItem>
                      <SelectItem value="fine">Fine</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit_title">Fee Title</Label>
                  <Input 
                    id="edit_title" 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_amount">Amount (₹)</Label>
                    <Input 
                      id="edit_amount" 
                      type="number" 
                      step="0.01"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_due_date">Due Date</Label>
                    <Input 
                      id="edit_due_date" 
                      type="date"
                      value={editForm.due_date}
                      onChange={(e) => setEditForm({...editForm, due_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit_description">Description (Optional)</Label>
                  <Textarea 
                    id="edit_description" 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditFeeDialog(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
