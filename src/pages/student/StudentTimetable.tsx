import { timetable } from "@/lib/mock-data";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentTimetable() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>
      <div className="space-y-4">
        {days.map(day => {
          const dayEntries = timetable.filter(t => t.day === day);
          if (dayEntries.length === 0) return null;
          return (
            <div key={day}>
              <h3 className="font-display font-semibold text-foreground mb-2">{day}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dayEntries.map(entry => (
                  <div key={entry.id} className="bg-card rounded-xl p-4 border shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-primary">{entry.courseCode}</span>
                      <span className="text-xs text-muted-foreground">{entry.startTime} - {entry.endTime}</span>
                    </div>
                    <h4 className="font-medium text-foreground text-sm">{entry.courseName}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{entry.room} • {entry.facultyName}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
