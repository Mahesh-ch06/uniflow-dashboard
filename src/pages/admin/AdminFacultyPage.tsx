import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { isEmailJsConfigured, sendFacultyWelcomeEmail } from '@/lib/email';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    staff_id: '',
    name: '',
    email: '',
    welcome_email: '',
    department: '',
    phone: '',
    password: '',
  });
  const [allBatches, setAllBatches] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [activeFacultyForBatches, setActiveFacultyForBatches] = useState<any>(null);
  const { toast } = useToast();

  const fetchFaculty = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faculty').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setFaculty(data || []);
    }
    setLoading(false);
  };

  const fetchBatches = async () => {
    const { data, error } = await supabase.from('students').select('batch_name');
    if (data && !error) {
      const batches = Array.from(new Set(data.map((s: any) => s.batch_name).filter(Boolean))).sort();
      setAllBatches(batches as string[]);
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchBatches();
  }, []);

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        staff_id: item.staff_id || '',
        name: item.name || '',
        email: item.email || '',
        welcome_email: item.email || '',
        department: item.department || '',
        phone: item.phone || '',
        password: item.password || 'UniManage@2026'
      });
    } else {
      setEditingId(null);
      setFormData({
        staff_id: '',
        name: '',
        email: '',
        welcome_email: '',
        department: '',
        phone: '',
        password: 'UniManage@2026',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.staff_id) {
      toast({ title: 'Missing fields', description: 'Name, Email, and Staff ID are required', variant: 'destructive' });
      return;
    }

    if (!editingId && !formData.welcome_email) {
      toast({ title: 'Missing fields', description: 'Welcome Email is required for new faculty creation', variant: 'destructive' });
      return;
    }

    const dbPayload = {
      staff_id: formData.staff_id,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      phone: formData.phone,
      password: formData.password,
    };
    
    try {
      if (editingId) {
        const { error } = await supabase.from('faculty').update(dbPayload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Faculty updated successfully' });
      } else {
        const { error } = await supabase.from('faculty').insert([dbPayload]);
        if (error) throw error;

        const emailResult = await sendFacultyWelcomeEmail({
          toEmail: formData.welcome_email,
          facultyName: formData.name,
          facultyId: formData.staff_id,
          password: formData.password,
          department: formData.department,
        });

        if (emailResult.ok) {
          toast({ title: 'Success', description: 'Faculty added and welcome email sent successfully' });
        } else {
          toast({
            title: 'Faculty created, email not sent',
            description: isEmailJsConfigured ? (emailResult.error || 'Failed to send welcome email') : 'Configure EmailJS environment variables to enable welcome emails.',
            variant: 'destructive',
          });
        }
      }
      setDialogOpen(false);
      fetchFaculty();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Faculty removed' });
      fetchFaculty();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleOpenBatchDialog = (item: any) => {
    setActiveFacultyForBatches(item);
    setSelectedBatches(item.assigned_batches || []);
    setBatchDialogOpen(true);
  };

  const handleToggleBatch = (batch: string) => {
    setSelectedBatches(prev => 
      prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
    );
  };

  const handleSaveBatches = async () => {
    if (!activeFacultyForBatches) return;
    try {
      const { error } = await supabase
        .from('faculty')
        .update({ assigned_batches: selectedBatches })
        .eq('id', activeFacultyForBatches.id);
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Assigned batches updated successfully' });
      setBatchDialogOpen(false);
      fetchFaculty();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty Management</h1>
          <p className="text-muted-foreground">Manage faculty accounts</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />Add Faculty
        </Button>
      </div>

      <DataTable
        data={faculty}
        searchKeys={['name', 'email', 'department', 'staff_id']}
        searchPlaceholder="Search faculty..."
        columns={[
          { key: 'staff_id', label: 'Staff ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'department', label: 'Department', render: (item: any) => <Badge variant="outline">{String(item.department)}</Badge> },
          { 
            key: 'assigned_batches', 
            label: 'Assigned Batches', 
            render: (item: any) => (
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {(item.assigned_batches || []).slice(0, 2).map((batch: string) => (
                  <Badge key={batch} variant="secondary" className="text-[10px]">{batch}</Badge>
                ))}
                {(item.assigned_batches || []).length > 2 && (
                  <Badge variant="secondary" className="text-[10px]">+{item.assigned_batches.length - 2} more</Badge>
                )}
                {(!item.assigned_batches || item.assigned_batches.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">None assigned</span>
                )}
              </div>
            ) 
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => handleOpenBatchDialog(item)} title="Assign Batches">
                  <Users className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(item)} title="Edit Faculty">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id as string)} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )
          }
        ]}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the details of the faculty member.' : 'Enter details for the new faculty member.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Staff ID</Label>
              <Input
                value={formData.staff_id}
                onChange={(e) => setFormData(prev => ({ ...prev, staff_id: e.target.value }))}
                placeholder="e.g. F001"
              />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Prof. James Anderson"
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="faculty@university.edu"
              />
            </div>
            {!editingId && (
              <div className="grid gap-2">
                <Label>Welcome Email</Label>
                <Input
                  type="email"
                  value={formData.welcome_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, welcome_email: e.target.value }))}
                  placeholder="email used for credentials delivery"
                />
                <p className="text-xs text-muted-foreground">Faculty ID and password will be sent to this email after account creation.</p>
              </div>
            )}
            <div className="grid gap-2">
              <Label>Department</Label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Optional..."
              />
            </div>
            {!editingId && (
              <div className="grid gap-2">
                <Label>Default Password</Label>
                <Input
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Batch Assignment Dialog */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Batches</DialogTitle>
            <DialogDescription>
              Select the batches that {activeFacultyForBatches?.name} is allowed to take attendance for.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm font-medium">Available Batches</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedBatches(selectedBatches.length === allBatches.length ? [] : [...allBatches])}
                className="h-8 text-xs"
              >
                {selectedBatches.length === allBatches.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
              {allBatches.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No batches found. Add some students first.</p>
              ) : (
                allBatches.map((batch) => (
                  <div key={batch} className="flex items-center space-x-2 border p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={`batch-${batch}`} 
                      checked={selectedBatches.includes(batch)}
                      onCheckedChange={() => handleToggleBatch(batch)}
                    />
                    <Label 
                      htmlFor={`batch-${batch}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {batch}
                    </Label>
                  </div>
                ))
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold">{selectedBatches.length}</span> batches selected out of {allBatches.length}.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBatches}>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
