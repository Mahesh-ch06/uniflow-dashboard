import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const bookStatusStyles = {
  "pending-to-return": "bg-primary/10 text-primary border-primary/20",
  returned: "bg-success/10 text-success border-success/30",
  overdue: "bg-destructive/10 text-destructive border-destructive/30",
};

const bookStatusLabels = {
  "pending-to-return": "Pending to Return",
  returned: "Returned",
  overdue: "Overdue",
};

export default function StudentLibrary() {
  const { user } = useAuth();

  // Fresh data logic (empty until fetched from DB)
  const libraryEntryExitLogs: any[] = [];
  const borrowedBooks: any[] = [];

  const takenBooks = borrowedBooks.length;
  const pendingToReturn = borrowedBooks.filter((book) => book.status === "pending-to-return").length;
  const overdueBooks = borrowedBooks.filter((book) => book.status === "overdue").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Library</h1>
        <p className="text-muted-foreground">Track your library entry/exit logs and books you have taken ({user?.name})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Taken Books</p>
          <p className="text-2xl font-display font-bold text-foreground mt-1">{takenBooks}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pending to Return</p>
          <p className="text-2xl font-display font-bold text-foreground mt-1">{pendingToReturn}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Overdue</p>
          <p className="text-2xl font-display font-bold text-destructive mt-1">{overdueBooks}</p>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Entry / Exit Logs</TabsTrigger>
          <TabsTrigger value="books">Books Taken</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-3">
          <DataTable
            data={libraryEntryExitLogs as unknown as Record<string, unknown>[]}
            searchKeys={["date", "gate"]}
            searchPlaceholder="Search by date or gate..."
            columns={[
              { key: "id", label: "Log ID" },
              { key: "date", label: "Date" },
              { key: "entryTime", label: "Entry" },
              { key: "exitTime", label: "Exit" },
              { key: "duration", label: "Duration" },
              { key: "gate", label: "Gate" },
            ]}
          />
        </TabsContent>

        <TabsContent value="books" className="space-y-3">
          <DataTable
            data={borrowedBooks as unknown as Record<string, unknown>[]}
            searchKeys={["title", "author", "status"]}
            searchPlaceholder="Search by title, author or status..."
            columns={[
              { key: "id", label: "Book ID" },
              { key: "title", label: "Book" },
              { key: "author", label: "Author" },
              { key: "issuedOn", label: "Issued On" },
              { key: "dueDate", label: "Due Date" },
              { key: "returnedOn", label: "Returned On" },
              {
                key: "status",
                label: "Status",
                render: (item) => (
                  <Badge
                    variant="outline"
                    className={cn(
                        "capitalize",
                      bookStatusStyles[String(item.status) as keyof typeof bookStatusStyles],
                    )}
                  >
                      {bookStatusLabels[String(item.status) as keyof typeof bookStatusLabels]}
                  </Badge>
                ),
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
