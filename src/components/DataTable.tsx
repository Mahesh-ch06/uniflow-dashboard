import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  selectedRows?: string[];
  onRowSelectionChange?: (selectedIds: string[]) => void;
  idKey?: keyof T;
}

export default function DataTable<T extends object>({
  columns, 
  data, 
  searchKeys = [], 
  searchPlaceholder = "Search...",
  enableRowSelection = false,
  selectedRows = [],
  onRowSelectionChange,
  idKey = 'id' as keyof T
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const getFieldValue = (item: T, key: string) => {
    return (item as Record<string, unknown>)[key];
  };

  const filtered = search && searchKeys.length
    ? data.filter(item => searchKeys.some(key => String(getFieldValue(item, key) ?? "").toLowerCase().includes(search.toLowerCase())))
    : data;

  const renderCellValue = (item: T, col: Column<T>) => {
    return col.render ? col.render(item) : String(getFieldValue(item, col.key) ?? "");
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelectionChange) return;
    if (checked) {
      const allIds = filtered.map(item => String(item[idKey]));
      onRowSelectionChange(allIds);
    } else {
      onRowSelectionChange([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (!onRowSelectionChange) return;
    if (checked) {
      onRowSelectionChange([...selectedRows, id]);
    } else {
      onRowSelectionChange(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const isAllSelected = filtered.length > 0 && filtered.every(item => selectedRows.includes(String(item[idKey])));

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            No records found
          </div>
        ) : (
          filtered.map((item, i) => {
            const rawItemId = item[idKey];
            const itemId = rawItemId === undefined || rawItemId === null || rawItemId === ""
              ? `row-${i}`
              : String(rawItemId);
            const isSelected = selectedRows.includes(itemId);

            return (
              <div key={itemId} className="rounded-xl border bg-card p-4 shadow-sm space-y-3" data-state={isSelected ? "selected" : undefined}>
                {enableRowSelection && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs text-muted-foreground">Select Row</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(!!checked, itemId)}
                      aria-label={`Select row ${itemId}`}
                    />
                  </div>
                )}

                {columns.map((col) => (
                  <div key={col.key} className="grid grid-cols-[110px_1fr] gap-2 text-sm items-start">
                    <span className="text-muted-foreground">{col.label}</span>
                    <div className="text-foreground break-words">{renderCellValue(item, col)}</div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      <div className="hidden md:block w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {enableRowSelection && (
                <TableHead className="w-12">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map(col => (
                <TableHead key={col.key} className="font-display font-semibold text-foreground">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, i) => {
                const rawItemId = item[idKey];
                const itemId = rawItemId === undefined || rawItemId === null || rawItemId === ""
                  ? `row-${i}`
                  : String(rawItemId);
                const isSelected = selectedRows.includes(itemId);
                
                return (
                  <TableRow key={itemId} className="hover:bg-muted/30 transition-colors" data-state={isSelected ? "selected" : undefined}>
                    {enableRowSelection && (
                      <TableCell className="w-12">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectRow(!!checked, itemId)}
                          aria-label={`Select row ${itemId}`}
                        />
                      </TableCell>
                    )}
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {renderCellValue(item, col)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
