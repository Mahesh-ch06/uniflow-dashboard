const fs = require("fs");
let code = fs.readFileSync("src/pages/student/StudentFees.tsx", "utf8");
console.log(code.indexOf("              </div>\n            </div>\n          </div>\n        </div>\n      );\n    };"));