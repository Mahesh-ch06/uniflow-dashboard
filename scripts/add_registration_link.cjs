const fs = require('fs');
let content = fs.readFileSync('src/pages/student/StudentDashboard.tsx', 'utf8');

if (!content.includes('<Link to="/student/courses">')) {
  if (!content.includes('import { Link } from "react-router-dom"')) {
    content = content.replace(
      'import { Badge } from "@/components/ui/badge";',
      'import { Link } from "react-router-dom";\nimport { Badge } from "@/components/ui/badge";\nimport { Button } from "@/components/ui/button";'
    );
  }

  const quickLinks = `
      <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-foreground">Academics & Registration</h3>
        </div>
        <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-foreground text-lg mb-1">Course Registration Pipeline</h4>
            <p className="text-sm text-muted-foreground">Enroll in upcoming semester courses, choose electives, and view your current subjects.</p>
          </div>
          <Button asChild className="shrink-0 gap-2">
            <Link to="/student/courses">
              <BookOpen className="h-4 w-4" /> Go to Course Registration
            </Link>
          </Button>
        </div>
      </div>
  `;

  content = content.replace(
    '          </div>\n        </div>\n      </div>\n    </div>\n  );\n}',
    '          </div>\n        </div>\n      </div>\n' + quickLinks + '\n    </div>\n  );\n}'
  );
  
  fs.writeFileSync('src/pages/student/StudentDashboard.tsx', content);
  console.log("Added Course Registration section!");
}
