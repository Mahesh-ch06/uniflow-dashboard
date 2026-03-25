const fs = require('fs');

async function fix() {
    let p = 'src/pages/student/StudentAttendance.tsx';
    let code = fs.readFileSync(p, 'utf8');

    // extract today
    let ts1 = '<TabsContent value="today" className="space-y-4">';
    let te1 = '</TabsContent>';
    
    let todayStart = code.lastIndexOf(ts1);
    if(todayStart === -1) {
        console.log("Already fixed or format changed");
        return;
    }
    let todayEnd = code.indexOf(te1, todayStart) + te1.length;
    
    let todayHtml = code.substring(todayStart, todayEnd);
    let codeBeforeToday = code.substring(0, todayStart);
    let codeAfterToday = code.substring(todayEnd);
    code = codeBeforeToday + codeAfterToday;
    
    // Process todayHtml to div
    todayHtml = todayHtml.replace(ts1, '<div id="today" className="space-y-4">').replace(te1, '</div>');
    
    // Inject nav buttons
    let tabsStart = code.indexOf('<Tabs defaultValue=');
    let tabsListEnd = code.indexOf('</TabsList>', tabsStart);
    if (tabsListEnd !== -1) {
        tabsListEnd += '</TabsList>'.length;
        
        let navButtons = `
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById('overview')?.scrollIntoView({behavior: 'smooth'})}>Overview</Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById('log')?.scrollIntoView({behavior: 'smooth'})}>Date-wise Log</Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById('requests')?.scrollIntoView({behavior: 'smooth'})}>Leave & Corrections</Button>
        </div>
        `;
        
        code = code.substring(0, tabsStart) + navButtons + code.substring(tabsListEnd);
    }
    
    // Replace remaining TabsContents with divs
    code = code.replace(/<TabsContent value="overview" className="space-y-4">/g, '<div id="overview" className="space-y-4 pt-6">');
    code = code.replace(/<TabsContent value="log" className="space-y-4">/g, '<div id="log" className="space-y-4 pt-6">');
    code = code.replace(/<TabsContent value="requests" className="space-y-4">/g, '<div id="requests" className="space-y-4 pt-6">');
    
    while(code.indexOf('</TabsContent>') !== -1) {
        code = code.replace('</TabsContent>', '</div>');
    }
    
    // Replace trailing Tabs
    code = code.replace('</Tabs>', '');
    
    // Extract everything from <div className="space-y-6"> and insert Today's classes
    // The Hero Card ends with </Card> before Tabs. Let's find "My Attendance"
    let myAtt = code.indexOf('<CardTitle>My Attendance</CardTitle>');
    let cardEnd = code.indexOf('</Card>', myAtt) + '</Card>'.length;
    
    code = code.substring(0, cardEnd) + '\n\n' + todayHtml + '\n\n' + code.substring(cardEnd);
    
    // Remove Tabs import
    code = code.replace(/import \{ Tabs, TabsContent, TabsList, TabsTrigger \} from "@\/components\/ui\/tabs";\n/g, '');
    
    fs.writeFileSync(p, code);
    console.log("Fixed layout");
}

fix();
