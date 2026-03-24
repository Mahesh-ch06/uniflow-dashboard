import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ staff_id: '', name: '', email: '', department: '', phone: '', password: '' });
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

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        staff_id: item.staff_id || '',
        name: item.name || '',
        email: item.email || '',
        department: item.department || '',
        phone: item.phone || '',
        password: item.password || 'UniManage@2026'
      });
    } else {
      setEditingId(null);
      setFormData({ staff_id: '', name: '', email: '', department: '', phone: '', password: 'UniManage@2026' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.staff_id) {
      toast({ title: 'Missing fields', description: 'Name, Email, and Staff ID are required', variant: 'destructive' });
      return;
    }
    
    try {
      if (editingId) {
        const { error } = await supabase.from('faculty').update(formData).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Faculty updated successfully' });
      } else {
        const { error } = await supabase.from('faculty').insert([formData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Faculty added successfully' });
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
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id as string)}>
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
    </div>
  );
}
