// Mock data for the University Management System

export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  batch?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  facultyId: string;
  facultyName: string;
  semester: string;
  enrolledStudents: number;
  maxCapacity: number;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface MarksRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assignment1: number;
  midterm: number;
  assignment2: number;
  final: number;
  total: number;
  grade: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  semester: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  totalFee: number;
  paidAmount: number;
  fine: number;
  status: "paid" | "partial" | "unpaid";
  dueDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  read: boolean;
  targetRole: UserRole | "all";
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  facultyName: string;
}

export const allStudents: User[] = [
  {
    "id": "2303A51002",
    "name": "AERRA VISHWA TEJ",
    "email": "2303a51002@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51005",
    "name": "BAISHETTY GEETHANJALI",
    "email": "2303a51005@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51006",
    "name": "BANDARI RAMCHARAN",
    "email": "2303a51006@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51007",
    "name": "BHUSHETTY BHARATH KUMAR",
    "email": "2303a51007@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51008",
    "name": "DADIGELA NAGATEJA",
    "email": "2303a51008@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51009",
    "name": "DARNA LIKHITHA",
    "email": "2303a51009@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51011",
    "name": "ENAGANTI ASMAJA",
    "email": "2303a51011@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51012",
    "name": "GODISHALA GOURI SHANKAR",
    "email": "2303a51012@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51013",
    "name": "GORANTALA SIDDARTHA",
    "email": "2303a51013@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51014",
    "name": "GUNDA SARAYU",
    "email": "2303a51014@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51015",
    "name": "GURRAPU SRIKARAN",
    "email": "2303a51015@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51016",
    "name": "ILONI AKSHITHA",
    "email": "2303a51016@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51017",
    "name": "ISHA MADEEHA",
    "email": "2303a51017@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51019",
    "name": "JANGAM SRIJITH RAO",
    "email": "2303a51019@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51021",
    "name": "KANKANALA ASHWITHA",
    "email": "2303a51021@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51022",
    "name": "KONDAPALLI SRUTHA KEERTHI",
    "email": "2303a51022@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51025",
    "name": "MADARAPU ANJALI",
    "email": "2303a51025@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51026",
    "name": "MADARAPU LIKHITH SAI",
    "email": "2303a51026@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51027",
    "name": "MADIREDDY ARAVIND REDDY",
    "email": "2303a51027@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51028",
    "name": "MALIPEDDI SHASHI PREETHAM",
    "email": "2303a51028@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51029",
    "name": "MITTAPELLY SRI CHARAN",
    "email": "2303a51029@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51030",
    "name": "MOHAMMAD ALTHAF",
    "email": "2303a51030@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51032",
    "name": "NARIGOPPULA SATHWIK",
    "email": "2303a51032@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51034",
    "name": "PEDDY CHANDRA VARDHAN REDDY",
    "email": "2303a51034@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51035",
    "name": "POLAKONDA GOURI PRASAD VARMA",
    "email": "2303a51035@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51037",
    "name": "SHIVANAND RAMA",
    "email": "2303a51037@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51041",
    "name": "VALLAMKONDA AKSHARA",
    "email": "2303a51041@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51043",
    "name": "RANGINENI SRIJA",
    "email": "2303a51043@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51104",
    "name": "GURRAM HARI PRIYA",
    "email": "2303a51104@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51227",
    "name": "ABHILASH VADUKARI",
    "email": "2303a51227@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB01"
  },
  {
    "id": "2303A51084",
    "name": "VUTLA PUNEETH TEJA",
    "email": "2303a51084@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51085",
    "name": "GADDE ANOOP GOUD",
    "email": "2303a51085@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51086",
    "name": "VELPULA ABHIRAM YADAV",
    "email": "2303a51086@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51087",
    "name": "ABHIRAM GUNDEKARI",
    "email": "2303a51087@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51089",
    "name": "ANIMIREDDY NAGA RISHIK REDDY",
    "email": "2303a51089@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51090",
    "name": "ARELLI ANAND",
    "email": "2303a51090@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51094",
    "name": "CHIRRA NAKSHATRA",
    "email": "2303a51094@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51095",
    "name": "CHITTAMPALLY VISHWANATH RAO",
    "email": "2303a51095@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51096",
    "name": "DADABOINA NITHIN",
    "email": "2303a51096@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51097",
    "name": "DHADABOINA BHARATH KUMAR",
    "email": "2303a51097@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51098",
    "name": "ERRABELLY SHIVANI",
    "email": "2303a51098@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51099",
    "name": "G K VENKATA NIRMALA HASINI",
    "email": "2303a51099@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A510A6",
    "name": "BADAVATH SARAYU NAIK",
    "email": "2303a510a6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51102",
    "name": "GUDA HARSHITHA",
    "email": "2303a51102@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51103",
    "name": "GUDIKANDULA VARSHITHA",
    "email": "2303a51103@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51105",
    "name": "HARSH RAJ RANJAN",
    "email": "2303a51105@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51106",
    "name": "KARNE RAHUL",
    "email": "2303a51106@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51108",
    "name": "KONDAPALLI DEVI PRIYANKA",
    "email": "2303a51108@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51109",
    "name": "MACHAGIRI HASINI",
    "email": "2303a51109@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51110",
    "name": "MARELLA AKSHITH",
    "email": "2303a51110@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51669",
    "name": "PANTHAGANI RISHYANTH",
    "email": "2303a51669@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51761",
    "name": "MALINENI LALITH KUMAR",
    "email": "2303a51761@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51768",
    "name": "MOHAMMED TABRAIZ KHAN",
    "email": "2303a51768@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51882",
    "name": "BANDA ROHITH",
    "email": "2303a51882@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51883",
    "name": "BANOTH JAMPANNA",
    "email": "2303a51883@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51884",
    "name": "BANTU VYSHNAVI",
    "email": "2303a51884@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51885",
    "name": "BEJJALA SRIKAR",
    "email": "2303a51885@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51887",
    "name": "BURRA PRASHANTH",
    "email": "2303a51887@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51888",
    "name": "CHITTI MANIDEEP",
    "email": "2303a51888@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A51889",
    "name": "CHITTIMALLA SUMANTH",
    "email": "2303a51889@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB02"
  },
  {
    "id": "2303A510F7",
    "name": "PINNINTI POOJA",
    "email": "2303a510f7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A510G3",
    "name": "NAINENI HASINI",
    "email": "2303a510g3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A510H8",
    "name": "BAKKI SAI SREEYESH",
    "email": "2303a510h8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A510H9",
    "name": "SNUHITH REDDY TELUKALA",
    "email": "2303a510h9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A510I3",
    "name": "SHASHANK YELAGUM",
    "email": "2303a510i3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51111",
    "name": "MILUKURI ROHITH REDDY",
    "email": "2303a51111@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51112",
    "name": "MUDEDLA SIRI VENNELA",
    "email": "2303a51112@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51115",
    "name": "NAGAVELLI ARUN KUMAR",
    "email": "2303a51115@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51116",
    "name": "NAGISHETTI PAUL BENJAMIN",
    "email": "2303a51116@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51117",
    "name": "NASANI SAI PAVAN",
    "email": "2303a51117@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51118",
    "name": "NELAMANCHA SUSHANTH REDDY",
    "email": "2303a51118@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51120",
    "name": "POGALLA ANEESH REDDY",
    "email": "2303a51120@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51121",
    "name": "POLAM SUMANTH",
    "email": "2303a51121@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51122",
    "name": "PUSALA ABHIRAM",
    "email": "2303a51122@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51125",
    "name": "SURYADEVARA RISHAAK",
    "email": "2303a51125@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51127",
    "name": "THALLAM SAI THRISHOOL",
    "email": "2303a51127@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51128",
    "name": "THOTA ANANYA",
    "email": "2303a51128@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51177",
    "name": "ADAPA AKSHITH REDDY",
    "email": "2303a51177@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51184",
    "name": "BONAGANI SAI TEJASWI",
    "email": "2303a51184@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51185",
    "name": "CHALLURI HARSHINI",
    "email": "2303a51185@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51186",
    "name": "CHITTALURI POOJA",
    "email": "2303a51186@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51187",
    "name": "CHITTIREDDY VARSHITHA",
    "email": "2303a51187@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51188",
    "name": "DURNALA VISHWATEJA",
    "email": "2303a51188@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51190",
    "name": "GAMPA RITHIKA",
    "email": "2303a51190@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51191",
    "name": "GHUTUKUDA SRIRAM",
    "email": "2303a51191@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51192",
    "name": "KARNAKANTI MANIDEEP",
    "email": "2303a51192@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51415",
    "name": "KARKA HANISHKA REDDY",
    "email": "2303a51415@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51449",
    "name": "KANAKAM VARSHITHA",
    "email": "2303a51449@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51606",
    "name": "NANDINI JALLELA",
    "email": "2303a51606@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB03"
  },
  {
    "id": "2303A51193",
    "name": "KARRE SREENIDHI",
    "email": "2303a51193@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51194",
    "name": "KATAKAM PRIYA",
    "email": "2303a51194@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51195",
    "name": "KODAM YASHWANTH",
    "email": "2303a51195@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51196",
    "name": "KOLLURI RAM CHARAN",
    "email": "2303a51196@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51200",
    "name": "KONDA SHIVA PRASAD",
    "email": "2303a51200@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51202",
    "name": "KOTHA SATHVIK REDDY",
    "email": "2303a51202@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51203",
    "name": "KUCHANA SAI ADITHYA",
    "email": "2303a51203@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51204",
    "name": "MADHARAPU PRAVALIKA",
    "email": "2303a51204@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51205",
    "name": "MASHETTI VYSHNAVI",
    "email": "2303a51205@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51206",
    "name": "MATTAPALLY SPRUSHEETH RAO",
    "email": "2303a51206@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51207",
    "name": "MD SUBHANI",
    "email": "2303a51207@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51209",
    "name": "NAGULA GOUTHAM",
    "email": "2303a51209@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51210",
    "name": "NARAHARI VISHNU VARDHAN REDDY",
    "email": "2303a51210@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51211",
    "name": "NEDUNOORI RUTHVIK SHARMA",
    "email": "2303a51211@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51212",
    "name": "NISHATH AFROZE",
    "email": "2303a51212@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51214",
    "name": "POTHARAJU SAMITH",
    "email": "2303a51214@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51215",
    "name": "RADHARAPU ARAVIND",
    "email": "2303a51215@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51216",
    "name": "RAVULA VYSHNAVI",
    "email": "2303a51216@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51217",
    "name": "SAMBARAJU VIGNESH",
    "email": "2303a51217@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51219",
    "name": "SUSHRUTH REDDY CHADA",
    "email": "2303a51219@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51220",
    "name": "THALLA SREEJA",
    "email": "2303a51220@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51221",
    "name": "THOTAKURI SAI SATHWIK",
    "email": "2303a51221@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51222",
    "name": "THUMIKI SATYA SREE",
    "email": "2303a51222@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51225",
    "name": "VEERAGONI MUKESH",
    "email": "2303a51225@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51226",
    "name": "VENUMUDDALA SAVANTH REDDY",
    "email": "2303a51226@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51831",
    "name": "SAI VARSHITH AGGADI",
    "email": "2303a51831@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51890",
    "name": "EDABOYINA RISHI",
    "email": "2303a51890@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51891",
    "name": "GADDAM SAI ANIRUDH",
    "email": "2303a51891@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB04"
  },
  {
    "id": "2303A51100",
    "name": "GANDLA RAHUL",
    "email": "2303a51100@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51218",
    "name": "SURISETTI ABHINAV",
    "email": "2303a51218@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51242",
    "name": "KANCHERLA AMULYA",
    "email": "2303a51242@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51273",
    "name": "AMAN SARKAR",
    "email": "2303a51273@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51276",
    "name": "BODLA MANISHWAR",
    "email": "2303a51276@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51278",
    "name": "BOMMERABOINA VARUNTEJ",
    "email": "2303a51278@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51279",
    "name": "BURRA AKSHARA",
    "email": "2303a51279@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51280",
    "name": "CHIRRA JYOTHIKA",
    "email": "2303a51280@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51281",
    "name": "CHUNCHU SIRI",
    "email": "2303a51281@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51282",
    "name": "EDULAKANTI RAMYA",
    "email": "2303a51282@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51283",
    "name": "GADE MYTHILI",
    "email": "2303a51283@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51286",
    "name": "IRUMALLA HASINI",
    "email": "2303a51286@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51288",
    "name": "KODAM ASRITHA",
    "email": "2303a51288@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51291",
    "name": "KONDAMGARI HITHESH",
    "email": "2303a51291@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51292",
    "name": "KURIMINDLA NAGA CHAITANYA",
    "email": "2303a51292@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51293",
    "name": "MADISHETTY SUNIL",
    "email": "2303a51293@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51294",
    "name": "MAMINDLA SHIVA SHANKAR",
    "email": "2303a51294@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51298",
    "name": "PAIDIPALA RAMCHARAN",
    "email": "2303a51298@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51303",
    "name": "SHAIK SABINA",
    "email": "2303a51303@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51304",
    "name": "UNNAM POOJITHA",
    "email": "2303a51304@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51305",
    "name": "UPPU SNEHANJALI",
    "email": "2303a51305@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51306",
    "name": "UTHURI KARTHIKEYA",
    "email": "2303a51306@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51308",
    "name": "VEERAMANENI SRUTHI",
    "email": "2303a51308@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51309",
    "name": "VEMPATI SIRI",
    "email": "2303a51309@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51310",
    "name": "VUTUKURU SAI ANAND",
    "email": "2303a51310@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51312",
    "name": "THUMMALA SHIVANI",
    "email": "2303a51312@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51314",
    "name": "DEVISETTY CHARMI",
    "email": "2303a51314@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51317",
    "name": "THAKUR SWETHA BAI",
    "email": "2303a51317@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51584",
    "name": "MARKA PREETHI MEGHANA",
    "email": "2303a51584@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A51612",
    "name": "GAJE HARIKA",
    "email": "2303a51612@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB05"
  },
  {
    "id": "2303A510C0",
    "name": "MD AMAN",
    "email": "2303a510c0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A510C1",
    "name": "SHAH ALAM",
    "email": "2303a510c1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A510C3",
    "name": "ABHISHEK YADAV",
    "email": "2303a510c3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A510F3",
    "name": "PRITTY BISWAS",
    "email": "2303a510f3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51354",
    "name": "NAREDLA DEEPTHI",
    "email": "2303a51354@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51366",
    "name": "BOLLAM SREEJA",
    "email": "2303a51366@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51372",
    "name": "KATHERLA HARI PRIYA",
    "email": "2303a51372@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51374",
    "name": "KOTHAPELLY MADHU SRI",
    "email": "2303a51374@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51377",
    "name": "MOHAMMED FARHANAZ",
    "email": "2303a51377@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51380",
    "name": "NIMMALA MEGHANA",
    "email": "2303a51380@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51382",
    "name": "SANDHI ABHINAY REDDY",
    "email": "2303a51382@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51383",
    "name": "SONTIREDDY AKSHITH REDDY",
    "email": "2303a51383@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51384",
    "name": "VANAPARTHI RISHIK",
    "email": "2303a51384@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51385",
    "name": "VANAPARTHI SIDDARTHA",
    "email": "2303a51385@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51386",
    "name": "VENNAM RISHIKESH",
    "email": "2303a51386@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51387",
    "name": "VOORUGONDA PREETHAM",
    "email": "2303a51387@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51388",
    "name": "ANANTHAPURAM AISHWARYA",
    "email": "2303a51388@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51389",
    "name": "ARSHIYA MAHEVEEN",
    "email": "2303a51389@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51392",
    "name": "ADAMA SUPREETH REDDY",
    "email": "2303a51392@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51394",
    "name": "ANISHETTI SRITHAM",
    "email": "2303a51394@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51395",
    "name": "ANNAPU VASANTHA SHOBA RANI",
    "email": "2303a51395@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51397",
    "name": "BADDAM SIDDU",
    "email": "2303a51397@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51399",
    "name": "MUDAPELLI RUSHIKESH",
    "email": "2303a51399@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51402",
    "name": "VANGA KALYAN PRASAD",
    "email": "2303a51402@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51403",
    "name": "SAKETH BIRRU",
    "email": "2303a51403@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51405",
    "name": "KANAPARTHI NIKITHA",
    "email": "2303a51405@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51407",
    "name": "CHALLA BHANU PRAKASH",
    "email": "2303a51407@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51613",
    "name": "SHAIK NISHAAJ",
    "email": "2303a51613@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51983",
    "name": "SHAIK AFROZ",
    "email": "2303a51983@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51988",
    "name": "MOHAMMAD ADIL",
    "email": "2303a51988@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB06"
  },
  {
    "id": "2303A51039",
    "name": "SOORABOINA TEJASHWINI",
    "email": "2303a51039@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A510A5",
    "name": "PONUGOTI REVANTH KUMAR",
    "email": "2303a510a5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51379",
    "name": "NALLAVENI CHARAN KUMAR",
    "email": "2303a51379@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51408",
    "name": "DESINI CHARANVITHA",
    "email": "2303a51408@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51409",
    "name": "JANGALA MEGHA HARSHA",
    "email": "2303a51409@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51419",
    "name": "KADARI PRANAY",
    "email": "2303a51419@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51438",
    "name": "DANIEL ANTHONELLO",
    "email": "2303a51438@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51455",
    "name": "BOPPIDI SANJANA REDDY",
    "email": "2303a51455@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51456",
    "name": "KOTHAPELLI PAVAN TEJA",
    "email": "2303a51456@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51457",
    "name": "NEELAM DHIREN",
    "email": "2303a51457@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51458",
    "name": "SANGANI MANIKANTA",
    "email": "2303a51458@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51461",
    "name": "MACHERLA DIVYA",
    "email": "2303a51461@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51462",
    "name": "MIDIDODDI SINDHU",
    "email": "2303a51462@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51463",
    "name": "GANTA HARSHITHA",
    "email": "2303a51463@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51464",
    "name": "MALYALA ANAND",
    "email": "2303a51464@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51466",
    "name": "PAKA AISHWARYA",
    "email": "2303a51466@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51467",
    "name": "DEEKONDA SAI",
    "email": "2303a51467@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51468",
    "name": "UPPU AKSHAAY",
    "email": "2303a51468@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51558",
    "name": "VISHAL KUMAR",
    "email": "2303a51558@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51590",
    "name": "BANDANA GIRI",
    "email": "2303a51590@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51617",
    "name": "KUCHANA VYSHNAVI",
    "email": "2303a51617@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51916",
    "name": "PESARU SATHYENDRA VARMA",
    "email": "2303a51916@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51917",
    "name": "RAVULA SIDDARTHA RAJ",
    "email": "2303a51917@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51920",
    "name": "SANGARABOINA VYSHANVI",
    "email": "2303a51920@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51946",
    "name": "VANKUDOTH DEEPAK",
    "email": "2303a51946@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51947",
    "name": "TRISHA JHA",
    "email": "2303a51947@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51948",
    "name": "AROORI LALU PRASAD",
    "email": "2303a51948@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51949",
    "name": "SYED AHMED HUSSAIN ULVAAN",
    "email": "2303a51949@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51950",
    "name": "DHARMARAM KEERTHANA",
    "email": "2303a51950@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A51951",
    "name": "CHALLURI PRUTHAGWIN",
    "email": "2303a51951@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB07"
  },
  {
    "id": "2303A510F8",
    "name": "YELUGAM MANIDEEP",
    "email": "2303a510f8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A510H7",
    "name": "KOMMAREDDY VAMSHIDHAR REDDY",
    "email": "2303a510h7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51271",
    "name": "PORIKA MANIKANTA",
    "email": "2303a51271@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51275",
    "name": "BANDA SHANUMUKA REDDY",
    "email": "2303a51275@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51475",
    "name": "MOHAMMAD MUNEER AHMED",
    "email": "2303a51475@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51480",
    "name": "PASULA SWANITEJ",
    "email": "2303a51480@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51483",
    "name": "MATTAPALLY SATHWIK",
    "email": "2303a51483@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51485",
    "name": "BIKKUMALLA ARJUN",
    "email": "2303a51485@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51488",
    "name": "PRANAVITH VELPULA",
    "email": "2303a51488@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51489",
    "name": "BODDU TEJAS KUMAR",
    "email": "2303a51489@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51492",
    "name": "BOCHHU SHRAVYA",
    "email": "2303a51492@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51495",
    "name": "MANUPATI ESHWAR",
    "email": "2303a51495@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51496",
    "name": "MOHAMMAD JAFFER SHAREEF",
    "email": "2303a51496@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51497",
    "name": "POLEPELLY SATHVIKA",
    "email": "2303a51497@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51498",
    "name": "UPPULA PRAGNASAHITHI",
    "email": "2303a51498@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51499",
    "name": "YARAVA POOJITHA",
    "email": "2303a51499@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51544",
    "name": "GOLI HARINI",
    "email": "2303a51544@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51545",
    "name": "MARRI ROHAN",
    "email": "2303a51545@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51548",
    "name": "NELLI RISHITHA",
    "email": "2303a51548@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51550",
    "name": "CHALLAGONDA NITHIN REDDY",
    "email": "2303a51550@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51551",
    "name": "BOLLAM SAI PRASANNA",
    "email": "2303a51551@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51623",
    "name": "BILLAKUDURU CHARAN",
    "email": "2303a51623@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51624",
    "name": "ILA HARSHITH",
    "email": "2303a51624@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51625",
    "name": "JINNA MADHUMITHA REDDY",
    "email": "2303a51625@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51626",
    "name": "VODAPALLI SRICHARITHA",
    "email": "2303a51626@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51737",
    "name": "BOINI CHANDU",
    "email": "2303a51737@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51819",
    "name": "KOTHAPALLY SAI CHARAN TEJA",
    "email": "2303a51819@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51842",
    "name": "BURUGU SARAYU",
    "email": "2303a51842@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51895",
    "name": "JULAPELLY VYSHNAVI",
    "email": "2303a51895@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51896",
    "name": "K SHIVA NANDINI",
    "email": "2303a51896@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB08"
  },
  {
    "id": "2303A51552",
    "name": "KAMBHAMPATI BHANU TEJASWI",
    "email": "2303a51552@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51553",
    "name": "MUDEDLA DAKSHINYA",
    "email": "2303a51553@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51555",
    "name": "KUSUMA PRANAY",
    "email": "2303a51555@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51557",
    "name": "THUMMALA TEJA SRI",
    "email": "2303a51557@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51562",
    "name": "JONNALAGADDA SAI KUMAR",
    "email": "2303a51562@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51564",
    "name": "GOPU SUHAS REDDY",
    "email": "2303a51564@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51565",
    "name": "PERUMANDLA SAI SHIVA RAMA KRISHNA",
    "email": "2303a51565@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51566",
    "name": "ERRA SRINIDHI REDDY",
    "email": "2303a51566@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51569",
    "name": "CHEPPALA RAM CHARAN GOUD",
    "email": "2303a51569@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51570",
    "name": "PORIKA CHARAN",
    "email": "2303a51570@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51571",
    "name": "MOGULOJU RISHI",
    "email": "2303a51571@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51575",
    "name": "ANKATHI YASHWANTH KUMAR",
    "email": "2303a51575@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51577",
    "name": "CHINTHALA DHAKSHAY REDDY",
    "email": "2303a51577@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51579",
    "name": "JAKKU DEVENDER",
    "email": "2303a51579@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51582",
    "name": "KADIYALA SREEJA",
    "email": "2303a51582@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51586",
    "name": "RAMPEESA SHASHI PREETHAM",
    "email": "2303a51586@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51587",
    "name": "VELPULA KARAN",
    "email": "2303a51587@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51639",
    "name": "AMANCHA SHASHANK",
    "email": "2303a51639@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51640",
    "name": "APPAM VIGNESH",
    "email": "2303a51640@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51643",
    "name": "KALAKONDA VAMSHI",
    "email": "2303a51643@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51649",
    "name": "RANGARAJU LOKESH",
    "email": "2303a51649@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51651",
    "name": "SURAM SHIVAMANI",
    "email": "2303a51651@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51652",
    "name": "VARIKUPPALA NITHIN",
    "email": "2303a51652@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51693",
    "name": "PALLAPU SIDDARTHA",
    "email": "2303a51693@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51779",
    "name": "CHINTHAM SAI SIDDHARTHA",
    "email": "2303a51779@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51814",
    "name": "KANDULA MITESH REDDY",
    "email": "2303a51814@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51897",
    "name": "KASHWAJULA RAGHAVENDRA",
    "email": "2303a51897@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51899",
    "name": "KONGONDA ABHINAY",
    "email": "2303a51899@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51901",
    "name": "MATTEWADA AMITH RAJIV",
    "email": "2303a51901@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51902",
    "name": "MEHER NAAZ",
    "email": "2303a51902@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB09"
  },
  {
    "id": "2303A51020",
    "name": "JONNALA PRANAY",
    "email": "2303a51020@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51060",
    "name": "MULA NIRNAYA",
    "email": "2303a51060@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A510I6",
    "name": "SARABU ANEESH",
    "email": "2303a510i6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51123",
    "name": "PUVATI VAMSHI VARDHAN RAO",
    "email": "2303a51123@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51197",
    "name": "KOMMARAJULA PRAKASH",
    "email": "2303a51197@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51295",
    "name": "MANDALA MADHURI",
    "email": "2303a51295@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51296",
    "name": "METHUKU HINDU",
    "email": "2303a51296@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51337",
    "name": "PABBU SRIVARSHA",
    "email": "2303a51337@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51343",
    "name": "SUNDARAGIRI RASHMITHA",
    "email": "2303a51343@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51355",
    "name": "YAMSANI SAI PRASANNA",
    "email": "2303a51355@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51396",
    "name": "ARUN KODURI",
    "email": "2303a51396@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51430",
    "name": "MADASI SATHWIK",
    "email": "2303a51430@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51477",
    "name": "DANDU RAHUL",
    "email": "2303a51477@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51490",
    "name": "CHETTIPALLY SRINIVAS REDDY",
    "email": "2303a51490@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51523",
    "name": "KODURI UDAY KIRAN",
    "email": "2303a51523@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51525",
    "name": "KONDLA THARUN",
    "email": "2303a51525@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51546",
    "name": "POLNENI SRINITHYA",
    "email": "2303a51546@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51563",
    "name": "SAMINENI HARSHAVARDHAN",
    "email": "2303a51563@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51581",
    "name": "GAI DIVYASREE",
    "email": "2303a51581@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51588",
    "name": "KATNAPALLY HARSHITHA",
    "email": "2303a51588@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51591",
    "name": "BOGELLI ROHITH",
    "email": "2303a51591@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51593",
    "name": "ALOKAM ROSHAN KUMAR",
    "email": "2303a51593@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51595",
    "name": "SHEELAM ARTHI",
    "email": "2303a51595@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51603",
    "name": "NAKKA ANIL",
    "email": "2303a51603@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51648",
    "name": "PADALLA SIDDARTHA",
    "email": "2303a51648@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51689",
    "name": "MYAKALA SANJAY",
    "email": "2303a51689@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51709",
    "name": "ANEM PRAMOD KUMAR",
    "email": "2303a51709@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51904",
    "name": "MULA VINEETH REDDY",
    "email": "2303a51904@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51959",
    "name": "MANDAPELLY AKSHITH NANDAN",
    "email": "2303a51959@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51960",
    "name": "KOMMINENI VENU",
    "email": "2303a51960@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB10"
  },
  {
    "id": "2303A51093",
    "name": "CHINTHALAPURI YASHWANTH",
    "email": "2303a51093@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A510F6",
    "name": "MOHAMMED AKRAMUDDIN",
    "email": "2303a510f6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A510G2",
    "name": "CHIRRA UDAY",
    "email": "2303a510g2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51301",
    "name": "VARDHINI PUVVATI",
    "email": "2303a51301@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51376",
    "name": "ADAVELLI HARIKA",
    "email": "2303a51376@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51572",
    "name": "ETURI BALAJI",
    "email": "2303a51572@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51710",
    "name": "ANUMALLA VIVEK SAI",
    "email": "2303a51710@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51713",
    "name": "BAROOR SUJAL REDDY",
    "email": "2303a51713@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51717",
    "name": "BUDATI GAYATHRI",
    "email": "2303a51717@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51718",
    "name": "CHALLAPALLI VISHNU VARDHAN",
    "email": "2303a51718@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51721",
    "name": "GANDI RAKESH",
    "email": "2303a51721@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51722",
    "name": "GONELA DILEEP KUMAR",
    "email": "2303a51722@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51724",
    "name": "KATTA LASYA",
    "email": "2303a51724@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51726",
    "name": "LINGAMPALLY SRINATH",
    "email": "2303a51726@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51729",
    "name": "P AJAY KUMAR PASULA",
    "email": "2303a51729@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51730",
    "name": "PENTA RAKESH",
    "email": "2303a51730@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51731",
    "name": "POLU SANJAY",
    "email": "2303a51731@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51732",
    "name": "SANKA SANTHOSH KUMAR",
    "email": "2303a51732@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51733",
    "name": "THOTAPALLY PRANATHI",
    "email": "2303a51733@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51734",
    "name": "VANGA RANJITH",
    "email": "2303a51734@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51745",
    "name": "AKSHAY PATEL MAMIDISHETTI",
    "email": "2303a51745@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51750",
    "name": "CHETLAPELLI SUSHANTH SANDESH",
    "email": "2303a51750@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51751",
    "name": "CHUNCHU CHARITH",
    "email": "2303a51751@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51753",
    "name": "DUDAMU PARDHU SRI",
    "email": "2303a51753@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51754",
    "name": "G DATHA NARAYANA",
    "email": "2303a51754@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51755",
    "name": "GAMPA MANI SHARANYA",
    "email": "2303a51755@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51756",
    "name": "GARISHELA AASHRITHA",
    "email": "2303a51756@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51758",
    "name": "JADALA VARSHINI",
    "email": "2303a51758@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51762",
    "name": "MAMILLAPALLY ABHISHEK",
    "email": "2303a51762@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51846",
    "name": "ELKAPELLI MADHU",
    "email": "2303a51846@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB11"
  },
  {
    "id": "2303A51763",
    "name": "MANEM SAI DEEP",
    "email": "2303a51763@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51764",
    "name": "MARUPATI YASHASWINI",
    "email": "2303a51764@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51765",
    "name": "MEKALA VIVEK VARDHAN",
    "email": "2303a51765@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51767",
    "name": "MOHAMMED AWEZ ALI",
    "email": "2303a51767@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51770",
    "name": "MOSES SUPREETH RAJ",
    "email": "2303a51770@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51771",
    "name": "MUNJALA SAI KRISHNA",
    "email": "2303a51771@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51772",
    "name": "NAGAVELLI SRIKAR",
    "email": "2303a51772@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51773",
    "name": "NAINI HARSHAVARDHAN",
    "email": "2303a51773@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51774",
    "name": "NIMISHAKAVI JAYANTH",
    "email": "2303a51774@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51778",
    "name": "PARIMALLA RISHIK",
    "email": "2303a51778@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51780",
    "name": "PONNAM SATHWIK GOUD",
    "email": "2303a51780@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51782",
    "name": "RAJ KUMAR GURRAPU",
    "email": "2303a51782@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51785",
    "name": "RAVULA YASHRITHA REDDY",
    "email": "2303a51785@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51786",
    "name": "REGURI CHAITRA REDDY",
    "email": "2303a51786@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51787",
    "name": "SAYABOINA SHIVA KUMAR",
    "email": "2303a51787@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51788",
    "name": "T HRUSHIKESH",
    "email": "2303a51788@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51793",
    "name": "VEERABATHINI AKSHARA JYOTHI",
    "email": "2303a51793@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51795",
    "name": "VIGHNESH BACHWAL",
    "email": "2303a51795@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51796",
    "name": "YADDANAPUDI HARINI",
    "email": "2303a51796@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51907",
    "name": "NALLAM SRI SHANTH",
    "email": "2303a51907@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51908",
    "name": "PALADUGULA KARTHIK",
    "email": "2303a51908@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51909",
    "name": "PALLE VENKATA GAYATHRI",
    "email": "2303a51909@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51911",
    "name": "PANCHAGIRI SAI BUNNY",
    "email": "2303a51911@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51912",
    "name": "PARUPALLY KOUSHIK",
    "email": "2303a51912@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51913",
    "name": "PEDDI SIDDHARTHA",
    "email": "2303a51913@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51921",
    "name": "SYED ABDUL MATEEN",
    "email": "2303a51921@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51922",
    "name": "VANAMA ABHILASH",
    "email": "2303a51922@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51935",
    "name": "MOHD MANZOOR AHMED",
    "email": "2303a51935@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A51942",
    "name": "VADLURI RAVITEJA",
    "email": "2303a51942@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB12"
  },
  {
    "id": "2303A510B6",
    "name": "MIRZA MUNEEB BAIG",
    "email": "2303a510b6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A510B9",
    "name": "GANDI SANJAY",
    "email": "2303a510b9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A510G0",
    "name": "VALABOJU SRI CHARAN",
    "email": "2303a510g0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51541",
    "name": "AIDULAPURAM SUSHMITHA",
    "email": "2303a51541@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51685",
    "name": "KATHERAPELLI VARSHITHA",
    "email": "2303a51685@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51727",
    "name": "LAKKARSU RISHINDRA SAI",
    "email": "2303a51727@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51840",
    "name": "BHUKYA BHANUMATHI",
    "email": "2303a51840@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51841",
    "name": "BOINI VINAY",
    "email": "2303a51841@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51843",
    "name": "BUSHIGAMPALA NITHINGOUD",
    "email": "2303a51843@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51844",
    "name": "CHUNCHU VENUGOPAL",
    "email": "2303a51844@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51845",
    "name": "DARURI NITHIN",
    "email": "2303a51845@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51847",
    "name": "ERUKALA NIKHIL",
    "email": "2303a51847@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51848",
    "name": "GADDAM SAI GANESH",
    "email": "2303a51848@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51849",
    "name": "GAIKWAD RITESH",
    "email": "2303a51849@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51850",
    "name": "GAJULA SPRIHA",
    "email": "2303a51850@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51851",
    "name": "GANDRA RAKESH RAO",
    "email": "2303a51851@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51852",
    "name": "GOTTIMUKKALA SHASHI KUMAR",
    "email": "2303a51852@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51853",
    "name": "GUGULOTH KALYAN",
    "email": "2303a51853@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51854",
    "name": "GULURI RAHUL GOUD",
    "email": "2303a51854@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51856",
    "name": "KAMATAM ABHINAV",
    "email": "2303a51856@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51857",
    "name": "KAMLI MANJULA",
    "email": "2303a51857@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51858",
    "name": "KARRE HARISH",
    "email": "2303a51858@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51862",
    "name": "KOMMU LOKESH",
    "email": "2303a51862@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51863",
    "name": "KOMMULA BHAVYA SRI",
    "email": "2303a51863@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51864",
    "name": "KOUDAGANI SUNNY",
    "email": "2303a51864@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51867",
    "name": "MOHAMMED ZAIDUDDIN",
    "email": "2303a51867@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51869",
    "name": "NEERATI SOUMYA",
    "email": "2303a51869@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51870",
    "name": "PERALA PRANAY",
    "email": "2303a51870@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A51871",
    "name": "RAAVI SHASHI DEEPIKA",
    "email": "2303a51871@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB13"
  },
  {
    "id": "2303A510A0",
    "name": "GONELA VISHNU VARDHAN",
    "email": "2303a510a0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510A1",
    "name": "DANDA BHANU",
    "email": "2303a510a1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510A2",
    "name": "METE BHARATH",
    "email": "2303a510a2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510A3",
    "name": "MALYALA SAI TEJA",
    "email": "2303a510a3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510A7",
    "name": "RAPOL ABHIRAM REDDY",
    "email": "2303a510a7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B1",
    "name": "BALA SATHWIK REDDY",
    "email": "2303a510b1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B2",
    "name": "KOLA AKHIL",
    "email": "2303a510b2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B3",
    "name": "MADARABOINA PRIYADARSHINI",
    "email": "2303a510b3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B4",
    "name": "K NITHIN KUMAR",
    "email": "2303a510b4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B7",
    "name": "SARVA HARINI",
    "email": "2303a510b7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510B8",
    "name": "MANAS PEDDA POLWAR",
    "email": "2303a510b8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510C7",
    "name": "SHERLA NIKHIL",
    "email": "2303a510c7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510D2",
    "name": "GANDLA KARTHIKEYA",
    "email": "2303a510d2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510D5",
    "name": "VANNALA VENUS NETHA",
    "email": "2303a510d5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510D6",
    "name": "VARIYOGULA SRUTHI",
    "email": "2303a510d6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510D7",
    "name": "VEERATI SATHWIK REDDY",
    "email": "2303a510d7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510E3",
    "name": "JANAMONI SRINIVAS",
    "email": "2303a510e3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510F0",
    "name": "MADALA MOHAN VENKATESH",
    "email": "2303a510f0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510F1",
    "name": "PATHAKALA THARUN KUMAR",
    "email": "2303a510f1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510F2",
    "name": "KANDUGULA ANITHA",
    "email": "2303a510f2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510G4",
    "name": "KONDA NITHISH RAJ",
    "email": "2303a510g4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A510H1",
    "name": "KASHIREDDY MAHESH REDDY",
    "email": "2303a510h1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51873",
    "name": "RAVULA VINEESHA",
    "email": "2303a51873@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51875",
    "name": "SUDAMALLA SIDDARTHA",
    "email": "2303a51875@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51876",
    "name": "THULASI SHYLASRI",
    "email": "2303a51876@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51879",
    "name": "ZOBIYA FATIMA",
    "email": "2303a51879@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51880",
    "name": "CHITYALA ARUSH NANDHAN",
    "email": "2303a51880@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51968",
    "name": "VUGGE VYSHNAVI",
    "email": "2303a51968@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2303A51970",
    "name": "SHAIK KHADAR HANEEF",
    "email": "2303a51970@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB14"
  },
  {
    "id": "2003A51286",
    "name": "THATIKONDA RAHUL",
    "email": "2003a51286@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A510F4",
    "name": "DERANGULA VISHNU TEJA",
    "email": "2303a510f4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A510G5",
    "name": "SIBBIDI SHARANYA",
    "email": "2303a510g5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A510H3",
    "name": "SAICHARAN NALLA",
    "email": "2303a510h3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51124",
    "name": "VANCHA SRAVYA",
    "email": "2303a51124@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51676",
    "name": "GUNDLAPALLI LOKESH REDDY",
    "email": "2303a51676@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51712",
    "name": "BANDI SHIVA SAKETH",
    "email": "2303a51712@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51719",
    "name": "DUMPETI SAI KOUSHIK",
    "email": "2303a51719@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51837",
    "name": "SAVANAPALLI VARSHITH",
    "email": "2303a51837@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51931",
    "name": "KAMARAPU SATHVEER",
    "email": "2303a51931@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51955",
    "name": "NIHARIKA PATHAK",
    "email": "2303a51955@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51971",
    "name": "SHAIK KHAJA NAWAZ",
    "email": "2303a51971@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51972",
    "name": "KURIMILLA MANOJ",
    "email": "2303a51972@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51973",
    "name": "CHEDELLA VENKATA SAI SRI RAM",
    "email": "2303a51973@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51974",
    "name": "PASEM RAJA NARESH",
    "email": "2303a51974@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51975",
    "name": "VELPULA CHANDINI",
    "email": "2303a51975@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51978",
    "name": "NAMULLA VENKATA SAIKUMAR",
    "email": "2303a51978@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51979",
    "name": "POLASA VISHNU PRANAY",
    "email": "2303a51979@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51981",
    "name": "PENUMALLU N D SURENDRA REDDY",
    "email": "2303a51981@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51982",
    "name": "SAMUDRALA MANOHAR",
    "email": "2303a51982@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51984",
    "name": "GARLAPATI RAJESHWAR REDDY",
    "email": "2303a51984@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51985",
    "name": "BAIRABATLA SAIRAM",
    "email": "2303a51985@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51987",
    "name": "THAKUR SRIRAMA SENANI SINGH",
    "email": "2303a51987@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51989",
    "name": "DUDIPALA SATHWIK REDDY",
    "email": "2303a51989@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51990",
    "name": "VUTHUNOORI ASHISH",
    "email": "2303a51990@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51993",
    "name": "BOJJA SUNNY KUMAR",
    "email": "2303a51993@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51995",
    "name": "MOHAMMED FAWAZ ALI",
    "email": "2303a51995@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51996",
    "name": "GUGULOTHU LAXMAN",
    "email": "2303a51996@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51997",
    "name": "MOHAMMED IRFAN",
    "email": "2303a51997@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51998",
    "name": "POTTAPENJARA KUNDAN SADHU YASWANTH",
    "email": "2303a51998@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB15"
  },
  {
    "id": "2303A51044",
    "name": "CHALLA ADARSH",
    "email": "2303a51044@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51045",
    "name": "BHOOPATHI SAI LAXMAN",
    "email": "2303a51045@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51046",
    "name": "BILLAKANTI SAI CHARAN",
    "email": "2303a51046@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51047",
    "name": "BOLLAM PAVAN ADHITYA",
    "email": "2303a51047@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51048",
    "name": "DEVULAPALLI NITHISH",
    "email": "2303a51048@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51050",
    "name": "DUGYALA VINAY",
    "email": "2303a51050@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51053",
    "name": "GANJI VARSHITHA",
    "email": "2303a51053@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51054",
    "name": "GANTA PREETHAM",
    "email": "2303a51054@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51055",
    "name": "JAKKULA SATHWIK",
    "email": "2303a51055@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51056",
    "name": "JUNURI SREEJA",
    "email": "2303a51056@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51057",
    "name": "KATAM VISHWESH REDDY",
    "email": "2303a51057@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51058",
    "name": "KURA UJWAL REDDY",
    "email": "2303a51058@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51061",
    "name": "MYAKALA PRAVEEN",
    "email": "2303a51061@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51063",
    "name": "NALLATEEGALA PRASHANTH",
    "email": "2303a51063@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51064",
    "name": "NAMUTHABAJI ROHAN",
    "email": "2303a51064@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51065",
    "name": "NARAGANI AKHIL",
    "email": "2303a51065@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51066",
    "name": "NELAKURTHI NITHISH",
    "email": "2303a51066@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51067",
    "name": "PANDYALA ABHIGNA",
    "email": "2303a51067@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51068",
    "name": "PATERU YASHWANTH",
    "email": "2303a51068@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51069",
    "name": "POGAKU VAISHNAVI",
    "email": "2303a51069@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51071",
    "name": "PULLURU LAHARI",
    "email": "2303a51071@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51072",
    "name": "RANGU AJAY",
    "email": "2303a51072@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51074",
    "name": "SAMALA DHEERAJ",
    "email": "2303a51074@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51075",
    "name": "SAMALA SATHWIKA",
    "email": "2303a51075@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51076",
    "name": "SANDHYA PRAVEEN KUMAR",
    "email": "2303a51076@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51078",
    "name": "THOTA AKANKSH",
    "email": "2303a51078@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51079",
    "name": "THOTAPALLY LOKESH",
    "email": "2303a51079@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A510F5",
    "name": "JANGAM NAVEEN KUMAR",
    "email": "2303a510f5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A510G8",
    "name": "CHERUKU VEDHAN",
    "email": "2303a510g8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A510I5",
    "name": "ADULAPURAM VISHWA TEJA",
    "email": "2303a510i5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB16"
  },
  {
    "id": "2303A51040",
    "name": "THOTA HEMANTH",
    "email": "2303a51040@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51083",
    "name": "VIBHUTHI RISHI SHANKAR SAI KAPIL",
    "email": "2303a51083@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A510C5",
    "name": "SAMEER AHMED",
    "email": "2303a510c5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A510H0",
    "name": "GANGILI SATHVIK",
    "email": "2303a510h0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A510J1",
    "name": "SABBANI NAVYA SRI",
    "email": "2303a510j1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A510J2",
    "name": "MORTHALA VISHNU",
    "email": "2303a510j2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51131",
    "name": "AKUTHOTA SRINIDHI",
    "email": "2303a51131@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51132",
    "name": "APARADHA KARTHIK",
    "email": "2303a51132@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51133",
    "name": "BOBBA SINDHUJA",
    "email": "2303a51133@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51135",
    "name": "BOINI SATHWIKA",
    "email": "2303a51135@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51136",
    "name": "CHALLA SRAVANI REDDY",
    "email": "2303a51136@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51139",
    "name": "ELLASAGARAM VAISHNAVI",
    "email": "2303a51139@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51141",
    "name": "JARATHI MANI TEJA PATEL",
    "email": "2303a51141@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51142",
    "name": "KANDAGATLA SAI PRANEETH",
    "email": "2303a51142@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51144",
    "name": "KATKAR SANSKAR",
    "email": "2303a51144@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51145",
    "name": "KENCHA BHAVITHA",
    "email": "2303a51145@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51146",
    "name": "KETHINI SUCHIRA",
    "email": "2303a51146@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51149",
    "name": "MAMIDALA ANSHUL KUMAR",
    "email": "2303a51149@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51150",
    "name": "MAMIDALA NIHARIKA",
    "email": "2303a51150@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51153",
    "name": "MOHAMMED ABDUL WASEY SUFYAN",
    "email": "2303a51153@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51154",
    "name": "MUNJA ASHRITH",
    "email": "2303a51154@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51155",
    "name": "MUSHAM VIKAS",
    "email": "2303a51155@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51157",
    "name": "PAPISHETTI VIJAYA LAXMI",
    "email": "2303a51157@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51158",
    "name": "PASUNUTI KOUSHIK",
    "email": "2303a51158@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51245",
    "name": "KONGA MANOJ KUMAR",
    "email": "2303a51245@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51284",
    "name": "GUNJE LAVANAND",
    "email": "2303a51284@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51447",
    "name": "ANAPURAM BHARGAVI",
    "email": "2303a51447@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51534",
    "name": "KURNA SATHWIKA",
    "email": "2303a51534@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51604",
    "name": "PANJALA NAGASOUMYA",
    "email": "2303a51604@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A51894",
    "name": "JADALA TEJA",
    "email": "2303a51894@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB17"
  },
  {
    "id": "2303A510I1",
    "name": "SHAHRUKH SYED",
    "email": "2303a510i1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51160",
    "name": "POCHAMPALLY VARSHITHA",
    "email": "2303a51160@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51161",
    "name": "POGALLA BHARGAVI",
    "email": "2303a51161@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51164",
    "name": "SABBU RAVI TEJA",
    "email": "2303a51164@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51165",
    "name": "SUNCHU THRISHLA PATEL",
    "email": "2303a51165@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51166",
    "name": "SWASTHIK VIRINCHI SINGARAYAKONDA",
    "email": "2303a51166@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51169",
    "name": "THANGALLAPALLY SRI SAI JAYARAM",
    "email": "2303a51169@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51170",
    "name": "THANGELLAPELLI RAMANATEJA",
    "email": "2303a51170@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51171",
    "name": "THATIPALLY ROHITH",
    "email": "2303a51171@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51172",
    "name": "THOTAKURI RAKSHITHA",
    "email": "2303a51172@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51173",
    "name": "VAVILLA KARTHIK",
    "email": "2303a51173@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51230",
    "name": "BAIRABOINA HAMSIKA",
    "email": "2303a51230@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51232",
    "name": "BOBBILI THARUN",
    "email": "2303a51232@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51234",
    "name": "CHETI AKHILA",
    "email": "2303a51234@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51235",
    "name": "DADI NISHANTH",
    "email": "2303a51235@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51236",
    "name": "DASARI SAI SIRI REDDY",
    "email": "2303a51236@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51237",
    "name": "DUGUTA INDRAKARAN",
    "email": "2303a51237@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51239",
    "name": "GUNTOJU AKSHAY VARDHAN",
    "email": "2303a51239@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51240",
    "name": "JANAMANCHI RAMA CHANDRA KASHYAP",
    "email": "2303a51240@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51243",
    "name": "KARNATI PALLAVI",
    "email": "2303a51243@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51246",
    "name": "KOPPU SHIVA",
    "email": "2303a51246@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51247",
    "name": "KORUKANTI NAGASRI",
    "email": "2303a51247@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51248",
    "name": "KOTHI NARENDRA",
    "email": "2303a51248@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51249",
    "name": "KOUSHAL PALA",
    "email": "2303a51249@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51250",
    "name": "LAVDIYA INDU",
    "email": "2303a51250@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51253",
    "name": "MOHAMMAD AFROZ",
    "email": "2303a51253@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51254",
    "name": "NALLA VAISHNAVI",
    "email": "2303a51254@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51607",
    "name": "CHETLAPALLY ROHITH SAI CHARY",
    "email": "2303a51607@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51667",
    "name": "MUDUMBA ABHIRAM",
    "email": "2303a51667@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51728",
    "name": "NALIVELA SIDHARTHA",
    "email": "2303a51728@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB18"
  },
  {
    "id": "2303A51233",
    "name": "BOLLAPALLI PALOMI GOUD",
    "email": "2303a51233@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51244",
    "name": "KAVETI SREENAVYA",
    "email": "2303a51244@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51256",
    "name": "PUNERIYA VINEETH KUMAR",
    "email": "2303a51256@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51257",
    "name": "SANGU UDAY",
    "email": "2303a51257@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51259",
    "name": "SYED MURTAZA",
    "email": "2303a51259@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51260",
    "name": "TENETI SRIHITHA",
    "email": "2303a51260@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51261",
    "name": "THIRUNAHARI SRIHARSHITHA",
    "email": "2303a51261@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51262",
    "name": "UNNI HARIKA",
    "email": "2303a51262@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51263",
    "name": "VAIDUGULA RITHIK REDDY",
    "email": "2303a51263@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51264",
    "name": "VALUPADASU TRINAYANI",
    "email": "2303a51264@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51266",
    "name": "VEMULA HARIVAMSH",
    "email": "2303a51266@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51267",
    "name": "VENDI KIRANMAI",
    "email": "2303a51267@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51268",
    "name": "VENGALA AJAY KUMAR",
    "email": "2303a51268@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51269",
    "name": "YADA SAHARSHA",
    "email": "2303a51269@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51270",
    "name": "MOODU PRASHANTH",
    "email": "2303a51270@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51274",
    "name": "ATHARI DEEPA",
    "email": "2303a51274@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51285",
    "name": "GUTAM GIRIDHAR REDDY",
    "email": "2303a51285@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51311",
    "name": "JAMMULA UMA BHARGAVI",
    "email": "2303a51311@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51319",
    "name": "ARPULA ANJALI",
    "email": "2303a51319@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51320",
    "name": "AVULA SHIVA SPANDANA",
    "email": "2303a51320@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51321",
    "name": "CHALLA MANMITH VARDHAN",
    "email": "2303a51321@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51322",
    "name": "CHITTI UDAYA SATHWIKA",
    "email": "2303a51322@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51323",
    "name": "DOMMATI DIVYA SRI",
    "email": "2303a51323@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51528",
    "name": "JUKANTI LOHITH",
    "email": "2303a51528@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51540",
    "name": "MAREPALLY NISHITHA",
    "email": "2303a51540@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51589",
    "name": "ABBIDI KRISHNA KOUSHIK",
    "email": "2303a51589@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51609",
    "name": "GAJU PRANATHI",
    "email": "2303a51609@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51610",
    "name": "RACHAKONDA BHARADWAJ",
    "email": "2303a51610@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51611",
    "name": "KASAM SATHWIK REDDY",
    "email": "2303a51611@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51938",
    "name": "CHINTAKUNTLA KOUSHIK",
    "email": "2303a51938@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB19"
  },
  {
    "id": "2303A51324",
    "name": "ENUKONDA MANUSREE",
    "email": "2303a51324@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51325",
    "name": "GUNDA MANOHAR REDDY",
    "email": "2303a51325@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51327",
    "name": "JONNALAGADDA SUJITH",
    "email": "2303a51327@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51329",
    "name": "KASHABOINA ARCHANA",
    "email": "2303a51329@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51330",
    "name": "KASHIREDDY AKSHITHA",
    "email": "2303a51330@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51331",
    "name": "KATUKOJWALA LIKHITH",
    "email": "2303a51331@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51332",
    "name": "KOTTE SNEHA",
    "email": "2303a51332@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51333",
    "name": "KUNCHALA RISHITHA",
    "email": "2303a51333@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51334",
    "name": "MOHAMMAD ARSHAD KHAJA MOINUDDIN",
    "email": "2303a51334@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51335",
    "name": "MUSKU KARTHIK REDDY",
    "email": "2303a51335@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51339",
    "name": "PEESARI NAVEEN",
    "email": "2303a51339@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51340",
    "name": "RAVULA ASHWITHA",
    "email": "2303a51340@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51342",
    "name": "SUDHAGANI SRINIDHI",
    "email": "2303a51342@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51344",
    "name": "SYED SHEEMA PATEL",
    "email": "2303a51344@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51345",
    "name": "TEMBARENI GOUTHAM REDDY",
    "email": "2303a51345@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51346",
    "name": "THATIKONDA SASYA",
    "email": "2303a51346@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51347",
    "name": "BAIRAGONI VAISHNAVI",
    "email": "2303a51347@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51348",
    "name": "VEDANT DILIP DERKAR",
    "email": "2303a51348@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51349",
    "name": "YELLAMPALLI TRIVENI",
    "email": "2303a51349@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51351",
    "name": "TUMMALA HARI VARSHITH",
    "email": "2303a51351@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51352",
    "name": "MILKURI NANDHITHA",
    "email": "2303a51352@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51356",
    "name": "EDDE POOJITHA",
    "email": "2303a51356@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51357",
    "name": "YADUGIRI RAJIV",
    "email": "2303a51357@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51358",
    "name": "MUPPARAPU GANESH KUMAR",
    "email": "2303a51358@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51359",
    "name": "ANAPURAM ABHILASH GOUD",
    "email": "2303a51359@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51361",
    "name": "SALENDRA NAGARAJU",
    "email": "2303a51361@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51417",
    "name": "CHEREPALLY AKHILA",
    "email": "2303a51417@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51615",
    "name": "KOLEATI PRANATHI",
    "email": "2303a51615@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51711",
    "name": "BANDA PRANEETH",
    "email": "2303a51711@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB20"
  },
  {
    "id": "2303A51024",
    "name": "MACHERLA AKHIL",
    "email": "2303a51024@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A510E9",
    "name": "THOTA VARSHITH",
    "email": "2303a510e9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A510I7",
    "name": "ALLI HARIKA",
    "email": "2303a510i7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51201",
    "name": "KOTA LOKESH",
    "email": "2303a51201@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51412",
    "name": "JULURI PAVAN",
    "email": "2303a51412@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51413",
    "name": "RACHARLA SAI KUNDAN",
    "email": "2303a51413@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51414",
    "name": "KOWDAGANI DEEKSHITH",
    "email": "2303a51414@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51418",
    "name": "NAGIREDDY YASHASWINI",
    "email": "2303a51418@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51420",
    "name": "ADEPU JEEVAN SAI",
    "email": "2303a51420@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51421",
    "name": "MOHD SHAHID",
    "email": "2303a51421@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51422",
    "name": "DHOMMATI AKASH",
    "email": "2303a51422@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51423",
    "name": "ADEPU TEJASWINI",
    "email": "2303a51423@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51424",
    "name": "NALUMASA THANAY",
    "email": "2303a51424@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51425",
    "name": "KASHIREDDY TEJASWINI",
    "email": "2303a51425@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51427",
    "name": "MOGILI KEERTHI",
    "email": "2303a51427@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51428",
    "name": "KALUSANI LAXMAN",
    "email": "2303a51428@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51431",
    "name": "BANDI SHASHANK",
    "email": "2303a51431@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51432",
    "name": "MOHAMMED INAYATH",
    "email": "2303a51432@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51433",
    "name": "MOHAMMED RAHIL RAZA",
    "email": "2303a51433@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51434",
    "name": "THABETI SAI SHARAN",
    "email": "2303a51434@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51435",
    "name": "PASULA SANJANA",
    "email": "2303a51435@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51436",
    "name": "MANDALA NAVEEN",
    "email": "2303a51436@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51440",
    "name": "BANDI YUVARAJ",
    "email": "2303a51440@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51441",
    "name": "NAGARAGANI VARSHITH",
    "email": "2303a51441@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51442",
    "name": "VISIKAMALLA VISHAL",
    "email": "2303a51442@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51444",
    "name": "MANDALA HARSHITH",
    "email": "2303a51444@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51448",
    "name": "GUMMADIRAJULA VAMSHI",
    "email": "2303a51448@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51450",
    "name": "LADE SHARAN SAI VARSHITH",
    "email": "2303a51450@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51452",
    "name": "PERUPOGU VAMSHI KRISHNA",
    "email": "2303a51452@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51453",
    "name": "SAMPELLY SUHAS",
    "email": "2303a51453@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB21"
  },
  {
    "id": "2303A51152",
    "name": "MATTAPALLY MEGHANA",
    "email": "2303a51152@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51505",
    "name": "GOURISHETTY SIRI CHANDANA",
    "email": "2303a51505@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51506",
    "name": "MOHAMMED SABIR",
    "email": "2303a51506@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51514",
    "name": "JAKKARAJU THRISHALA",
    "email": "2303a51514@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51515",
    "name": "BATTI CHANDAN SINGH",
    "email": "2303a51515@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51516",
    "name": "BANDI AKHIRA NANDHINI",
    "email": "2303a51516@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51519",
    "name": "LINGAM HEMANTH",
    "email": "2303a51519@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51522",
    "name": "CHATHARABOINA SAGAR",
    "email": "2303a51522@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51524",
    "name": "USILLA MANOJ",
    "email": "2303a51524@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51526",
    "name": "GINNE SAI TEJA",
    "email": "2303a51526@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51529",
    "name": "THAKUR PHANI KUMAR",
    "email": "2303a51529@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51530",
    "name": "BOLLEDLA SRIVARSHITH REDDY",
    "email": "2303a51530@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51532",
    "name": "CHANDA WISHRAM",
    "email": "2303a51532@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51535",
    "name": "THOTA SAITEJA",
    "email": "2303a51535@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51536",
    "name": "BATHINI SAI RITHVIK",
    "email": "2303a51536@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51538",
    "name": "GUNTURU DEVI PRASAD",
    "email": "2303a51538@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51539",
    "name": "KESOJU SAI KIRAN",
    "email": "2303a51539@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51542",
    "name": "RAIREDDY SHIVASAI REDDY",
    "email": "2303a51542@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51583",
    "name": "KOMMU MADHUPRIYA",
    "email": "2303a51583@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51619",
    "name": "GUNREDDY DHANUSH REDDY",
    "email": "2303a51619@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51621",
    "name": "KUSHAL MANDAL",
    "email": "2303a51621@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51628",
    "name": "GOLLEPELLY NAVAJEEVAN",
    "email": "2303a51628@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51629",
    "name": "JILLELA AKSHAYA",
    "email": "2303a51629@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51677",
    "name": "KAVATI CHAITANYA",
    "email": "2303a51677@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51952",
    "name": "BANNA LIKHITHA",
    "email": "2303a51952@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51953",
    "name": "THANGALLAPALLI HARSHITHA",
    "email": "2303a51953@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51954",
    "name": "GUGULOTH NAVEEN KUMAR",
    "email": "2303a51954@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51956",
    "name": "JANNU ATHYUNNATHA",
    "email": "2303a51956@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51957",
    "name": "UDDEMARI SHARWAN",
    "email": "2303a51957@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51958",
    "name": "MUTHYAM LIKITHA",
    "email": "2303a51958@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB22"
  },
  {
    "id": "2303A51033",
    "name": "A LAXMI PRASANNA",
    "email": "2303a51033@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A510G6",
    "name": "GANDRA CHARANYA",
    "email": "2303a510g6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A510H4",
    "name": "THEJAVATH MEGHANA NAIK",
    "email": "2303a510h4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A510I2",
    "name": "KASURI ROHITH",
    "email": "2303a510i2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A510I8",
    "name": "CHEARLA SAI CHARAN",
    "email": "2303a510i8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51272",
    "name": "AKKAPALLY SRIVANI",
    "email": "2303a51272@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51451",
    "name": "MERGU KARTHEEJA",
    "email": "2303a51451@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51630",
    "name": "KONDABATTINI NITHIN KUMAR",
    "email": "2303a51630@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51631",
    "name": "LETHAKULA ANVITHA REDDY",
    "email": "2303a51631@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51635",
    "name": "SANDESARI KEERTHI",
    "email": "2303a51635@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51638",
    "name": "CHALLURI NANDA KISHORE",
    "email": "2303a51638@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51658",
    "name": "BHUKYA ROHITH",
    "email": "2303a51658@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51659",
    "name": "BOINAPALLY NALINI MOHAN",
    "email": "2303a51659@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51660",
    "name": "CHADA RAMAKRISHNA REDDY",
    "email": "2303a51660@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51661",
    "name": "CHALUVADI HARISH RAO",
    "email": "2303a51661@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51663",
    "name": "DANDU SHRUTHI",
    "email": "2303a51663@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51664",
    "name": "DATLA SREEJA",
    "email": "2303a51664@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51665",
    "name": "DENCHANADULA SANDEEP",
    "email": "2303a51665@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51666",
    "name": "DODLA SONY",
    "email": "2303a51666@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51668",
    "name": "ESLAVATH VENNELA",
    "email": "2303a51668@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51670",
    "name": "GANNEBOINA SAMSHRAY",
    "email": "2303a51670@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51671",
    "name": "GOLI SRIJA",
    "email": "2303a51671@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51672",
    "name": "GOLLA MANIDHAR YADAV",
    "email": "2303a51672@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51673",
    "name": "GUNDEBOINA NAGARAJU",
    "email": "2303a51673@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51674",
    "name": "HAJIRA NAUSHEEN",
    "email": "2303a51674@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51675",
    "name": "HANMAKONDA HIRANYA",
    "email": "2303a51675@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51679",
    "name": "KONKALA AISHWARYA",
    "email": "2303a51679@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51680",
    "name": "KOTHURI RISHITHA",
    "email": "2303a51680@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51923",
    "name": "VANGA SRAVANI",
    "email": "2303a51923@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A51925",
    "name": "VARNE AJAY",
    "email": "2303a51925@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB23"
  },
  {
    "id": "2303A510G9",
    "name": "BANDARI REVANTH",
    "email": "2303a510g9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A510J4",
    "name": "SANITH AKULA",
    "email": "2303a510j4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51163",
    "name": "PUSKURI ASHWITHA",
    "email": "2303a51163@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51401",
    "name": "NAGIREDDY SOUKYA",
    "email": "2303a51401@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51410",
    "name": "NIMMALA NANDA MUKESH",
    "email": "2303a51410@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51478",
    "name": "KANNEBOINA ANIRUDH YADAV",
    "email": "2303a51478@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51681",
    "name": "KYASA SAI TEJA",
    "email": "2303a51681@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51683",
    "name": "MEKHALA RANADEEP",
    "email": "2303a51683@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51686",
    "name": "MOHAMMED NAVEED",
    "email": "2303a51686@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51687",
    "name": "MULAGUNDLA ADARSH REDDY",
    "email": "2303a51687@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51688",
    "name": "MUTHYALA CHANDHANA",
    "email": "2303a51688@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51691",
    "name": "NAGAVELLY BHUVAN VEER",
    "email": "2303a51691@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51692",
    "name": "NIKSHITHA KURUSAM",
    "email": "2303a51692@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51694",
    "name": "PASUNURI NIHARIKA",
    "email": "2303a51694@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51698",
    "name": "KANDUKURI SANATH KUMAR",
    "email": "2303a51698@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51703",
    "name": "THIRUNAGARI PHANINDRA",
    "email": "2303a51703@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51704",
    "name": "UNDILLA AKHIL",
    "email": "2303a51704@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51705",
    "name": "UPPULA SUSHMITHA",
    "email": "2303a51705@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51707",
    "name": "VELPULA VIGNESH",
    "email": "2303a51707@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51708",
    "name": "YAMSANI NIKHIL",
    "email": "2303a51708@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51747",
    "name": "BANDLOJU BHARGAVA CHARY",
    "email": "2303a51747@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51794",
    "name": "VANGA VAMSHIDHAR REDDY",
    "email": "2303a51794@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51859",
    "name": "TAMANNA",
    "email": "2303a51859@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51874",
    "name": "SHAIK ASHRAF ALI",
    "email": "2303a51874@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51898",
    "name": "KATHARE VAISHNAVI",
    "email": "2303a51898@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51900",
    "name": "MALYALA ANU CHANDRA",
    "email": "2303a51900@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51962",
    "name": "CHINTHALAPHANI SRIHAN REDDY",
    "email": "2303a51962@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51963",
    "name": "KODURU PRUDHVI RAJ",
    "email": "2303a51963@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51964",
    "name": "UPPULA VIGNESH",
    "email": "2303a51964@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A51965",
    "name": "HEMAVATHI N",
    "email": "2303a51965@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB24"
  },
  {
    "id": "2303A510C4",
    "name": "SHAIK ABDUL MANNAAN",
    "email": "2303a510c4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A510E0",
    "name": "BIRAPAKA ABHINAV",
    "email": "2303a510e0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A510E1",
    "name": "KARRU BHARGAVA NANDAN REDDY",
    "email": "2303a510e1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51491",
    "name": "SIDDHARTHA REDDY KOTHA",
    "email": "2303a51491@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51502",
    "name": "NUKALA MOHAN SAI GUPTA",
    "email": "2303a51502@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51504",
    "name": "MOUNA SRI PARVATHAPU",
    "email": "2303a51504@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51510",
    "name": "VELURU AKHILESH",
    "email": "2303a51510@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51547",
    "name": "SRIPERAMBUDURI SRIRAM",
    "email": "2303a51547@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51556",
    "name": "SRIPERUMBUDURI SAI ANUSHA",
    "email": "2303a51556@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51561",
    "name": "MAREDUGONDA VYSHNAVI",
    "email": "2303a51561@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51592",
    "name": "RAJULADEVI RAGHURAM",
    "email": "2303a51592@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51596",
    "name": "GUNDA ADITHYA",
    "email": "2303a51596@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51602",
    "name": "KURAKULA HARINI SRI",
    "email": "2303a51602@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51618",
    "name": "CHIPPA VASU",
    "email": "2303a51618@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51620",
    "name": "KARABI MANDAL",
    "email": "2303a51620@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51632",
    "name": "MACHARLA ASHWITHA",
    "email": "2303a51632@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51634",
    "name": "RUSHIKESH EAGA",
    "email": "2303a51634@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51735",
    "name": "BHUDDEWAR ARUN",
    "email": "2303a51735@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51738",
    "name": "GADDAM GURU CHARAN REDDY",
    "email": "2303a51738@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51739",
    "name": "GANGULA NAVYA SRI",
    "email": "2303a51739@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51740",
    "name": "GULLAPUDI BHARGAV GUPTHA",
    "email": "2303a51740@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51741",
    "name": "MANISH REDDY MULA",
    "email": "2303a51741@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51742",
    "name": "PANDUGA RAKESH",
    "email": "2303a51742@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51743",
    "name": "SRAVAN KORE",
    "email": "2303a51743@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51744",
    "name": "SRIRAMOJI HARSHA VARDHAN",
    "email": "2303a51744@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51801",
    "name": "BEVARA KARTEEK",
    "email": "2303a51801@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51893",
    "name": "GUNDA VENKATARAMANA",
    "email": "2303a51893@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51903",
    "name": "MOTHUKURI ASHWITH",
    "email": "2303a51903@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51924",
    "name": "VANGALA ANJALI",
    "email": "2303a51924@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A51940",
    "name": "YASA SOWMYA",
    "email": "2303a51940@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB25"
  },
  {
    "id": "2303A510E7",
    "name": "KUSUMA RITHIK",
    "email": "2303a510e7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51113",
    "name": "ABBU HARIKA",
    "email": "2303a51113@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51228",
    "name": "VALLE ASHISH",
    "email": "2303a51228@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51404",
    "name": "CHALLAGURUGULA KRUTHAN KIRAN",
    "email": "2303a51404@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51512",
    "name": "AELLA NANDINI",
    "email": "2303a51512@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51580",
    "name": "AKKINA SAI KULWANTH",
    "email": "2303a51580@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51797",
    "name": "ANNAPAREDDY SRI BHUVANA",
    "email": "2303a51797@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51798",
    "name": "ASHADAPU SHASHIDHAR",
    "email": "2303a51798@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51803",
    "name": "BODASU NITHIN",
    "email": "2303a51803@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51805",
    "name": "BOLLAM SRUJAN KUMAR",
    "email": "2303a51805@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51806",
    "name": "CHIDARLA SHIVAMANI",
    "email": "2303a51806@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51807",
    "name": "GADDAM BHAGATH",
    "email": "2303a51807@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51808",
    "name": "GANGAVATH ESHWAR",
    "email": "2303a51808@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51810",
    "name": "GODISHALA VISHNU VARDHAN",
    "email": "2303a51810@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51811",
    "name": "ISLAVATH ABHINAY POWAR",
    "email": "2303a51811@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51812",
    "name": "JAKKULA TEJESH",
    "email": "2303a51812@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51813",
    "name": "JETTI MUKHESH",
    "email": "2303a51813@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51815",
    "name": "KASUBOJULA VARDHAN CHARY",
    "email": "2303a51815@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51816",
    "name": "KETHAVATH KARAN SINGH",
    "email": "2303a51816@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51817",
    "name": "KOLGURI AKSHAY",
    "email": "2303a51817@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51820",
    "name": "MANCHIKATLA AKASH",
    "email": "2303a51820@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51821",
    "name": "MEDABOINA PRADEEP",
    "email": "2303a51821@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51822",
    "name": "MOHAMMED AFZAL",
    "email": "2303a51822@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51823",
    "name": "MOHAMMED SHEHBAAZ",
    "email": "2303a51823@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51825",
    "name": "ORSU ISRAEL",
    "email": "2303a51825@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51827",
    "name": "PASHAM ABHIRAM REDDY",
    "email": "2303a51827@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51829",
    "name": "PUJARI PRANAY KUMAR",
    "email": "2303a51829@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51830",
    "name": "RAMAGIRI PRAJWAL",
    "email": "2303a51830@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51832",
    "name": "SHIVAKOTI SHAMBHAVI",
    "email": "2303a51832@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A51833",
    "name": "SOSAKANDLA AISHWARYA",
    "email": "2303a51833@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB26"
  },
  {
    "id": "2303A510A8",
    "name": "POLU SHIVA SAI RAM GOUD",
    "email": "2303a510a8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A510C8",
    "name": "JETTI SRINIVAS",
    "email": "2303a510c8@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A510D0",
    "name": "SINGATHI MANOJ",
    "email": "2303a510d0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A510D1",
    "name": "BOINI SAI TEJA",
    "email": "2303a510d1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A510E5",
    "name": "PODDUTOORI AGASTHYA SAI",
    "email": "2303a510e5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A510H2",
    "name": "MUTHINENI RAHUL",
    "email": "2303a510h2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51134",
    "name": "BODDIREDDY VIKHYATH REDDY",
    "email": "2303a51134@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51159",
    "name": "PATEL HARSHIT",
    "email": "2303a51159@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51297",
    "name": "NUNEMUNTHALA RAHUL",
    "email": "2303a51297@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51390",
    "name": "BANOTH VEERANNA",
    "email": "2303a51390@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51406",
    "name": "KOKKONDA HARSHAVARDHAN",
    "email": "2303a51406@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51476",
    "name": "KONDANI KRANTHI PRASAD",
    "email": "2303a51476@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51479",
    "name": "LAKSHMISETTY SRI RAM",
    "email": "2303a51479@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51494",
    "name": "KATIPAGALA PAVANI",
    "email": "2303a51494@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51511",
    "name": "KOMMIDI PRADEEP REDDY",
    "email": "2303a51511@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51834",
    "name": "SUDHATI SAI PAVAN RAO",
    "email": "2303a51834@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51835",
    "name": "THOTA SHIVA LINGESHWAR",
    "email": "2303a51835@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51836",
    "name": "THOTA VISHNUVARDAN",
    "email": "2303a51836@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51838",
    "name": "VEMULA VIVEK",
    "email": "2303a51838@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51839",
    "name": "VENNAM JAHNAVI",
    "email": "2303a51839@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51933",
    "name": "RANGU AKSHAY",
    "email": "2303a51933@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51934",
    "name": "ANUMULA NIKHIL",
    "email": "2303a51934@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51937",
    "name": "KALLEM SIRI CHANDANA",
    "email": "2303a51937@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51939",
    "name": "KOLA KARTHIK",
    "email": "2303a51939@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51941",
    "name": "GOPI BHARADWAJ",
    "email": "2303a51941@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51943",
    "name": "ERRA VAISHNAVI",
    "email": "2303a51943@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51944",
    "name": "CHALLA TEJASWI",
    "email": "2303a51944@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51945",
    "name": "PUPPALA NAGA SHIVA CHAITANYA",
    "email": "2303a51945@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51967",
    "name": "ERRABELLI PRASHANTH",
    "email": "2303a51967@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51994",
    "name": "BHURGULA RANJITH",
    "email": "2303a51994@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB27"
  },
  {
    "id": "2303A51018",
    "name": "JANGA SANJANA",
    "email": "2303a51018@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51038",
    "name": "SIDDANTHI PRANAVA SAI",
    "email": "2303a51038@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A510J0",
    "name": "ROHIT KUMAR",
    "email": "2303a510j0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51585",
    "name": "ORUGANTI SREEJA",
    "email": "2303a51585@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51642",
    "name": "JAKKANABOINA LOKESH",
    "email": "2303a51642@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51644",
    "name": "KANKANALA ANJALI",
    "email": "2303a51644@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51653",
    "name": "VEM SAI AKSHAYA",
    "email": "2303a51653@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51654",
    "name": "ALLA SRI RAM",
    "email": "2303a51654@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51656",
    "name": "ATHMAKURI ABHISHEK",
    "email": "2303a51656@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51657",
    "name": "BATHINI VAISHNAVI",
    "email": "2303a51657@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51678",
    "name": "KONDA SAI KARTHIK",
    "email": "2303a51678@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51682",
    "name": "MADADI OMSAI",
    "email": "2303a51682@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51690",
    "name": "NAGAPURI SATWIKA",
    "email": "2303a51690@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51695",
    "name": "PULLURI NANDHINI",
    "email": "2303a51695@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51700",
    "name": "SOMU MAHITHA REDDY",
    "email": "2303a51700@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51706",
    "name": "VANKA RIPUNJAYANI",
    "email": "2303a51706@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51759",
    "name": "JOGU KOWSHIK",
    "email": "2303a51759@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51760",
    "name": "KUNCHAPARTHI SAI SATHVIK",
    "email": "2303a51760@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51781",
    "name": "POTTAPINJARA POORNA SAI NEHAL",
    "email": "2303a51781@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51789",
    "name": "THIRUMANI KONDA SRI CHARAN TEJ",
    "email": "2303a51789@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51804",
    "name": "BODDU MANISHA",
    "email": "2303a51804@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51868",
    "name": "MYLARAPU VAMSHI KRISHNA",
    "email": "2303a51868@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51878",
    "name": "YARAGALLA KOTESWARA RAO",
    "email": "2303a51878@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51892",
    "name": "GOTTIMUKKULA RISHWANTH REDDY",
    "email": "2303a51892@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51905",
    "name": "ERRABELLY SREEJA",
    "email": "2303a51905@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51910",
    "name": "PALVAI SRIHITHA REDDY",
    "email": "2303a51910@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51919",
    "name": "RUSHIKETHANA GOTTIMUKKULA",
    "email": "2303a51919@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51961",
    "name": "SAI VAIKALPIKA UPPARA",
    "email": "2303a51961@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB28"
  },
  {
    "id": "2303A51042",
    "name": "ZOHAIB ABOOD",
    "email": "2303a51042@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51059",
    "name": "MOHAMMED JAWWAD KHAN",
    "email": "2303a51059@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51062",
    "name": "NAGISHETTI BLESSY",
    "email": "2303a51062@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51091",
    "name": "AREPALLY RAMCHARAN",
    "email": "2303a51091@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510C2",
    "name": "MUJTABA AHMED",
    "email": "2303a510c2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510C9",
    "name": "BALLA MARY ANIVIKA CHOWDARY",
    "email": "2303a510c9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510D9",
    "name": "OKILLI KARTHIK REDDY",
    "email": "2303a510d9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510E2",
    "name": "MOHAMMED SOHAIL ARIF",
    "email": "2303a510e2@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510E6",
    "name": "BOORA ANUSHKA",
    "email": "2303a510e6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510J3",
    "name": "DACHAPALLY LOKESH REDDY",
    "email": "2303a510j3@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51176",
    "name": "VOORUGONDA ANUSHKA",
    "email": "2303a51176@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51178",
    "name": "ADEPU SATHWIK",
    "email": "2303a51178@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51360",
    "name": "NAMPALLI AKSHITHA",
    "email": "2303a51360@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51416",
    "name": "YEROJU ANJALI",
    "email": "2303a51416@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51465",
    "name": "SAYAM SHREE PRIYA",
    "email": "2303a51465@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51474",
    "name": "HABEEBA KHANAM",
    "email": "2303a51474@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51543",
    "name": "VELDI HRUTHIKA",
    "email": "2303a51543@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51554",
    "name": "ACHI VAISHNAVI",
    "email": "2303a51554@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51559",
    "name": "SADULA PREM KUMAR",
    "email": "2303a51559@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51560",
    "name": "ESHWARA PRAGADA SAI ANURATH",
    "email": "2303a51560@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51567",
    "name": "PERUMALLA SUSHWANTH",
    "email": "2303a51567@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51574",
    "name": "BANTUPALLI PAVAN PRANEETH",
    "email": "2303a51574@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51598",
    "name": "SHAIK NEHA FARIYAL",
    "email": "2303a51598@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51599",
    "name": "YELISETTY MANIKANTA",
    "email": "2303a51599@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51600",
    "name": "THALLAPALLY ARSHAVARDHINI",
    "email": "2303a51600@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51637",
    "name": "SUDDALA SHRYITHA",
    "email": "2303a51637@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51641",
    "name": "GULLURI RITHU GOUD",
    "email": "2303a51641@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51655",
    "name": "ASWIN V MADHU",
    "email": "2303a51655@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51684",
    "name": "MODUGU HANISHKA",
    "email": "2303a51684@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A51802",
    "name": "BILLA SPURTHI",
    "email": "2303a51802@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB29"
  },
  {
    "id": "2303A510F9",
    "name": "GANGILI SATHVIKA",
    "email": "2303a510f9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510G1",
    "name": "POTHARAJU SANDEEP",
    "email": "2303a510g1@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510G7",
    "name": "ANUMALA SRAVANI",
    "email": "2303a510g7@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510H5",
    "name": "MEKAPOTHULA PARIMALA",
    "email": "2303a510h5@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510H6",
    "name": "AMMULA ANUSHA",
    "email": "2303a510h6@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510I0",
    "name": "VELPULA HARIKA",
    "email": "2303a510i0@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510I4",
    "name": "PABBA SHIVANI",
    "email": "2303a510i4@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A510I9",
    "name": "ABBANAPURAM RAMYA SRI",
    "email": "2303a510i9@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51860",
    "name": "AATIQAH HARMIN",
    "email": "2303a51860@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51886",
    "name": "BELLAMKONDA SAI SPURTHI",
    "email": "2303a51886@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51918",
    "name": "RUDROJU RUPA SRI",
    "email": "2303a51918@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51927",
    "name": "DARMINI VARSHITHA",
    "email": "2303a51927@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51928",
    "name": "GUNDAPUNENI ARNAV",
    "email": "2303a51928@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51929",
    "name": "MENDU KAVYA SRI",
    "email": "2303a51929@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51930",
    "name": "MIRYALA SAI TEJA",
    "email": "2303a51930@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51932",
    "name": "RANGU TEENESHWARI",
    "email": "2303a51932@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A51980",
    "name": "SYED SUFIYANUDDIN",
    "email": "2303a51980@student.univ.edu",
    "role": "student",
    "department": "ECE",
    "batch": "23CSBTB30"
  },
  {
    "id": "2303A52001",
    "name": "BANOTH TEJASHWINI",
    "email": "2303a52001@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52002",
    "name": "BELLAMPALLY KOUSHIK REDDY",
    "email": "2303a52002@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52003",
    "name": "BIJJALA VRINDHA",
    "email": "2303a52003@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52004",
    "name": "BOGA SIRICHANDANA",
    "email": "2303a52004@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52005",
    "name": "BURRA PRANEETH",
    "email": "2303a52005@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52007",
    "name": "KEERTHI SURYA TEJA",
    "email": "2303a52007@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52010",
    "name": "MACHARLA GOUTHAM",
    "email": "2303a52010@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52011",
    "name": "NAMPALLY NITHIN VARMA",
    "email": "2303a52011@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52012",
    "name": "PALAKURTHI LALITH PRAKASH",
    "email": "2303a52012@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52013",
    "name": "PORANDLA THRISHANK",
    "email": "2303a52013@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52014",
    "name": "RAVULA VIDYA SRI",
    "email": "2303a52014@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52015",
    "name": "SOODA NIDHI KATHYAYINI",
    "email": "2303a52015@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52016",
    "name": "SYED ZAID SAMI KHIZAR",
    "email": "2303a52016@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52017",
    "name": "THAKUR AKSHAYA",
    "email": "2303a52017@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52037",
    "name": "CHITIKESHI MAHESH",
    "email": "2303a52037@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52038",
    "name": "MADADI UDAY",
    "email": "2303a52038@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52039",
    "name": "MARIPELLI CHODHITHA",
    "email": "2303a52039@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52040",
    "name": "MOHAMMED FARHAN AHMED",
    "email": "2303a52040@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52044",
    "name": "RACHAMALLA NIHARSHITH",
    "email": "2303a52044@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52215",
    "name": "ROHITH REDDY VANGALA",
    "email": "2303a52215@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52334",
    "name": "KOTA SRI PRIYA",
    "email": "2303a52334@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52366",
    "name": "ASHFIYA JABEEN",
    "email": "2303a52366@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52407",
    "name": "DURKI SHRUTHI",
    "email": "2303a52407@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52433",
    "name": "VODNALA AKSHITH",
    "email": "2303a52433@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52435",
    "name": "ANKAM SRICHALA",
    "email": "2303a52435@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52442",
    "name": "MYAKA AKHILA",
    "email": "2303a52442@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52448",
    "name": "GANTA CHARVIKA",
    "email": "2303a52448@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52455",
    "name": "AIDALAPURAM TEJA SRI",
    "email": "2303a52455@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52484",
    "name": "PEDDITI RUTHWICK REDDY",
    "email": "2303a52484@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52489",
    "name": "KANDHUKURI SAKETH",
    "email": "2303a52489@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB31"
  },
  {
    "id": "2303A52045",
    "name": "RACHAMALLA SRI SAI GOURISHWAR",
    "email": "2303a52045@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52046",
    "name": "RASAMALLA KEERTHI SREE",
    "email": "2303a52046@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52049",
    "name": "THALLA ARAVIND",
    "email": "2303a52049@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52064",
    "name": "AKULA ARUN",
    "email": "2303a52064@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52065",
    "name": "AYESHA AHMED ILYAS",
    "email": "2303a52065@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52066",
    "name": "GOLI NITHYA",
    "email": "2303a52066@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52067",
    "name": "KADARI THARANI",
    "email": "2303a52067@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52069",
    "name": "KEESARI RUCHITHA REDDY",
    "email": "2303a52069@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52070",
    "name": "KUKKALA TRINAY PRASAD",
    "email": "2303a52070@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52071",
    "name": "NAGASANI TRINANDINI",
    "email": "2303a52071@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52072",
    "name": "NOMULA ESHWAR",
    "email": "2303a52072@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52073",
    "name": "SAKINALA YAGNESHWAR",
    "email": "2303a52073@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52143",
    "name": "PARUMANDLA HEMANTH KUMAR",
    "email": "2303a52143@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52229",
    "name": "PAKA MANI TEJA",
    "email": "2303a52229@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52298",
    "name": "MUNIGALA TEJA",
    "email": "2303a52298@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52341",
    "name": "ANKAM NITEESH KUMAR",
    "email": "2303a52341@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52349",
    "name": "KOMURAVELLY PRUDVI RAJ",
    "email": "2303a52349@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52364",
    "name": "ALLAM VIJAYA KARUNYA",
    "email": "2303a52364@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52374",
    "name": "KOMURAVELLI NAVANEETH",
    "email": "2303a52374@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52390",
    "name": "AITA DEEPTHI",
    "email": "2303a52390@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52409",
    "name": "VANGARI HANSIKA",
    "email": "2303a52409@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52411",
    "name": "KOLA KISHORE",
    "email": "2303a52411@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52413",
    "name": "JUNENI VARSHITHA",
    "email": "2303a52413@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52417",
    "name": "KOMMI REDDY RUPAASSHYNI",
    "email": "2303a52417@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52419",
    "name": "ENUMULA ANJANI",
    "email": "2303a52419@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52421",
    "name": "PALABINDALA REVANTH",
    "email": "2303a52421@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52429",
    "name": "VALLALA VYSHNAVI",
    "email": "2303a52429@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52456",
    "name": "PINGILI NAGASRI",
    "email": "2303a52456@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52471",
    "name": "BANALA RITHIMA",
    "email": "2303a52471@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52485",
    "name": "MUMMIDI JAYANTH",
    "email": "2303a52485@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB32"
  },
  {
    "id": "2303A52092",
    "name": "ADAPA PRASHANTH",
    "email": "2303a52092@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52093",
    "name": "BETHI NAVEEN KUMAR",
    "email": "2303a52093@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52095",
    "name": "CHIRRA RAM CHARAN",
    "email": "2303a52095@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52096",
    "name": "KANDAGATLA SATHWIKA",
    "email": "2303a52096@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52097",
    "name": "KOPPULA REETHI LAKSHMI",
    "email": "2303a52097@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52098",
    "name": "NITESH KUMAR",
    "email": "2303a52098@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52099",
    "name": "PASHIKANTI KARTHISHA",
    "email": "2303a52099@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52100",
    "name": "PEDIRIPATI SRI CHARAN GOUD",
    "email": "2303a52100@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52101",
    "name": "PENDRU SAI PRAVEER  REDDY",
    "email": "2303a52101@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52102",
    "name": "POUDALA SUSHANTHI",
    "email": "2303a52102@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52103",
    "name": "RECHARLA ANIRUDH",
    "email": "2303a52103@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52104",
    "name": "RENATLA DEEKSHITH GOUD",
    "email": "2303a52104@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52105",
    "name": "RUDROJU SOWMYA SRI",
    "email": "2303a52105@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52106",
    "name": "DINGARI SRIRAM",
    "email": "2303a52106@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52121",
    "name": "THODETI INDRANEEL",
    "email": "2303a52121@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52122",
    "name": "VADDE MOKSHITHA",
    "email": "2303a52122@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52125",
    "name": "AYUSH PANDYA",
    "email": "2303a52125@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52126",
    "name": "BITLA THANMAI",
    "email": "2303a52126@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52127",
    "name": "DOMALA MANIDEEP",
    "email": "2303a52127@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52207",
    "name": "PARUSHA SINDHU",
    "email": "2303a52207@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52332",
    "name": "KODURI TEJASWINI",
    "email": "2303a52332@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52357",
    "name": "JYOTHI SATHWIK",
    "email": "2303a52357@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52365",
    "name": "AJMERA RUCHITHA",
    "email": "2303a52365@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52375",
    "name": "VAKULABHARANAM SHIVA HARSHA",
    "email": "2303a52375@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52377",
    "name": "ENDLA ESHWAR PRASAD",
    "email": "2303a52377@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52385",
    "name": "AMMA ANJALI",
    "email": "2303a52385@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52404",
    "name": "ELLANDULA KARTHIK",
    "email": "2303a52404@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52415",
    "name": "SWETHA DIXIT",
    "email": "2303a52415@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52423",
    "name": "DONIKENA RITHWIK GOUD",
    "email": "2303a52423@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52437",
    "name": "MUSTHYALA SAI SURYA",
    "email": "2303a52437@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB33"
  },
  {
    "id": "2303A52128",
    "name": "MODEM PRANAV",
    "email": "2303a52128@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52129",
    "name": "NELLUTLA LASYA PRIYA",
    "email": "2303a52129@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52131",
    "name": "VEDASREE MADURI",
    "email": "2303a52131@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52132",
    "name": "VEMULA GANESH",
    "email": "2303a52132@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52155",
    "name": "KANUKUNTLA SHAILAJA",
    "email": "2303a52155@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52157",
    "name": "KIRTHAN SAINI",
    "email": "2303a52157@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52158",
    "name": "ARENDALA SATHWIK",
    "email": "2303a52158@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52160",
    "name": "KEDALA SHIVA CHARAN",
    "email": "2303a52160@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52161",
    "name": "VANAMAMALY DHARMATEJ",
    "email": "2303a52161@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52163",
    "name": "UGGE MAHEESH VARMA",
    "email": "2303a52163@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52164",
    "name": "KODAM SHISHIR BHAGATH",
    "email": "2303a52164@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52165",
    "name": "MITTAPALLI SRIRAM",
    "email": "2303a52165@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52166",
    "name": "NAMINDLA ALLEN NICOLAS",
    "email": "2303a52166@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52168",
    "name": "MOHAMMED SUHAIBIQBAL",
    "email": "2303a52168@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52183",
    "name": "MORAPALLY MANIDEEP REDDY",
    "email": "2303a52183@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52187",
    "name": "BOPPIDI MANALI REDDY",
    "email": "2303a52187@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52189",
    "name": "KOTHAKONDA SRIJA",
    "email": "2303a52189@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52191",
    "name": "AKARAPU SUMANTH",
    "email": "2303a52191@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52192",
    "name": "MEERIPRELLY SAI CHARANI",
    "email": "2303a52192@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52194",
    "name": "GANDRA VISHNUVARDHAN RAO",
    "email": "2303a52194@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52337",
    "name": "SANJAY KARUPOTHULA",
    "email": "2303a52337@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52347",
    "name": "MUTHOJU PRAVALIKA",
    "email": "2303a52347@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52351",
    "name": "SANIYA BEGUM",
    "email": "2303a52351@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52361",
    "name": "GUMUDAVELLI SHRAVANI",
    "email": "2303a52361@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52371",
    "name": "GUNDE SANDEEP",
    "email": "2303a52371@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52387",
    "name": "MAIDAMSHETTI HARISH",
    "email": "2303a52387@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52388",
    "name": "VEERAMANENI SATHVIK",
    "email": "2303a52388@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52431",
    "name": "GATTU USHA SREE",
    "email": "2303a52431@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52440",
    "name": "RAVULA SEETHARAM REDDY",
    "email": "2303a52440@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52454",
    "name": "SHIFA MAHEEN",
    "email": "2303a52454@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB34"
  },
  {
    "id": "2303A52149",
    "name": "GANGIDI RISHITHA",
    "email": "2303a52149@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52167",
    "name": "ADDAGATTA SAI TEJA",
    "email": "2303a52167@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52195",
    "name": "GAJU ABHILASH",
    "email": "2303a52195@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52196",
    "name": "BETHI MOUNIKA",
    "email": "2303a52196@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52197",
    "name": "GONELA RISHIKA",
    "email": "2303a52197@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52198",
    "name": "UPPUNUTHULA ROHITH",
    "email": "2303a52198@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52199",
    "name": "GADDAM RUSHINDHRA GOUD",
    "email": "2303a52199@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52200",
    "name": "AMEERSHETTY VISHNU VARDHAN",
    "email": "2303a52200@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52201",
    "name": "KONDA MANOJ KUMAR",
    "email": "2303a52201@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52202",
    "name": "RAVULA KARTHIK",
    "email": "2303a52202@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52204",
    "name": "SAI SATHWIKA DASU",
    "email": "2303a52204@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52209",
    "name": "KAIRAM AKSHAY GOUD",
    "email": "2303a52209@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52210",
    "name": "DARSANALA ARUN TEJA",
    "email": "2303a52210@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52225",
    "name": "KOLLURI SRINADH",
    "email": "2303a52225@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52235",
    "name": "GUJJETI MANIKANTA",
    "email": "2303a52235@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52238",
    "name": "SAI VAMSHI CHAKALI",
    "email": "2303a52238@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52239",
    "name": "SILIVERU VYSHNAVI",
    "email": "2303a52239@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52301",
    "name": "SUDHAVENI RAJESH",
    "email": "2303a52301@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52325",
    "name": "KANDAGATLA SAI TEJA",
    "email": "2303a52325@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52330",
    "name": "BANDI RITHWIK",
    "email": "2303a52330@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52416",
    "name": "AKKATI AKSHAYA",
    "email": "2303a52416@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52418",
    "name": "ORSU VENNELA",
    "email": "2303a52418@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52426",
    "name": "JULURU SAI HARINI",
    "email": "2303a52426@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52449",
    "name": "MOLMOORI AKSHAYA",
    "email": "2303a52449@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52457",
    "name": "DUGYALA NITHYA",
    "email": "2303a52457@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52462",
    "name": "BILLA MAHANAND",
    "email": "2303a52462@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52470",
    "name": "MOHAMMAD ARKAN",
    "email": "2303a52470@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52476",
    "name": "BUDATI BHARGAVA REDDY",
    "email": "2303a52476@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52479",
    "name": "MITTAPALLY SHIVANI",
    "email": "2303a52479@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52487",
    "name": "GUNDAVARAM LIKHITHA RAO",
    "email": "2303a52487@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB35"
  },
  {
    "id": "2303A52159",
    "name": "SRIHARSHA THOTA",
    "email": "2303a52159@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52212",
    "name": "CHINNAPALLY PRANAY SAI",
    "email": "2303a52212@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52214",
    "name": "MOHAMMED FAISALUDDIN",
    "email": "2303a52214@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52237",
    "name": "PUJARI BHARATH",
    "email": "2303a52237@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52242",
    "name": "BOLLOJU HARSHINI",
    "email": "2303a52242@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52244",
    "name": "MOHAMMED ADNAN AWAISE",
    "email": "2303a52244@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52246",
    "name": "MOHAMMED SAFHAN FAROOQI",
    "email": "2303a52246@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52261",
    "name": "SHIVVA RAVI KIRAN",
    "email": "2303a52261@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52263",
    "name": "KATTA KEERTHI REDDY",
    "email": "2303a52263@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52266",
    "name": "BOLLAM SHERLIN VARSHITHA",
    "email": "2303a52266@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52267",
    "name": "CHUKKA SURYA KIRAN",
    "email": "2303a52267@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52268",
    "name": "DARABOINA VARSHITHA",
    "email": "2303a52268@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52269",
    "name": "GADDAM PADMAVATHI",
    "email": "2303a52269@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52273",
    "name": "KUDITHADI VYSHNAVI",
    "email": "2303a52273@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52274",
    "name": "LAKKIDI SRINIVAS REDDY",
    "email": "2303a52274@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52275",
    "name": "MADATHA SIDDESHWAR",
    "email": "2303a52275@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52277",
    "name": "MUDAM RAJA",
    "email": "2303a52277@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52278",
    "name": "P ARUN KUMAR REDDY",
    "email": "2303a52278@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52352",
    "name": "ELIKATTE THARUN",
    "email": "2303a52352@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52356",
    "name": "KUMBA GANESH",
    "email": "2303a52356@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52359",
    "name": "GONDA VIGNESH",
    "email": "2303a52359@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52384",
    "name": "THUMATI VARDHAN",
    "email": "2303a52384@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52397",
    "name": "ORUGANTI SAI KEERTHANA",
    "email": "2303a52397@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52403",
    "name": "GURRAM LAXMI PRANAV",
    "email": "2303a52403@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52408",
    "name": "THUMATI RAVALI",
    "email": "2303a52408@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52420",
    "name": "PENTHALA ASHWITHA",
    "email": "2303a52420@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52424",
    "name": "SHAIK SUBHANI",
    "email": "2303a52424@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52428",
    "name": "THUMATI BHAVANA SRI",
    "email": "2303a52428@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52464",
    "name": "RAVULA AKSHITHA",
    "email": "2303a52464@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52473",
    "name": "NIMMALA ASHOK",
    "email": "2303a52473@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB36"
  },
  {
    "id": "2303A52074",
    "name": "SHAIK MOULANA",
    "email": "2303a52074@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52076",
    "name": "THUMMA HASINI",
    "email": "2303a52076@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52077",
    "name": "THUMMA VISHAL",
    "email": "2303a52077@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52133",
    "name": "ADDAGUDI SHRUTHI",
    "email": "2303a52133@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52220",
    "name": "CHILUKALA SAI ARCHITHA",
    "email": "2303a52220@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52227",
    "name": "CHEERA SREE KUMARA",
    "email": "2303a52227@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52228",
    "name": "KOKKIRALA ABHINAY RAO",
    "email": "2303a52228@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52233",
    "name": "CHITTIMALLA MADHAVI",
    "email": "2303a52233@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52240",
    "name": "GUNDELLI ABHILASH",
    "email": "2303a52240@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52243",
    "name": "GADIDASU SRI SAHITH",
    "email": "2303a52243@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52247",
    "name": "PULLA SWARAN RAJ",
    "email": "2303a52247@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52254",
    "name": "ERRAGOLLA ABHI RAM",
    "email": "2303a52254@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52279",
    "name": "PUNNAM SAI CHARAN",
    "email": "2303a52279@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52280",
    "name": "REVURI RONITH REDDY",
    "email": "2303a52280@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52287",
    "name": "GATLA VARSHITH REDDY",
    "email": "2303a52287@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52303",
    "name": "NIMMAGADDA SHREE DEEPTHI",
    "email": "2303a52303@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52311",
    "name": "KAMANI SHALINI",
    "email": "2303a52311@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52314",
    "name": "KEDALA SAHITHYA",
    "email": "2303a52314@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52317",
    "name": "DUGGISHETTI VARSHITHA",
    "email": "2303a52317@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52321",
    "name": "KOKKULA SAIKRISHNA",
    "email": "2303a52321@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52322",
    "name": "KANCHARLA RAHUL",
    "email": "2303a52322@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52323",
    "name": "KANCHARLA HARSHINI",
    "email": "2303a52323@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52328",
    "name": "ASHUTOSH KUMAR",
    "email": "2303a52328@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52353",
    "name": "MOKIDI SRINIDHI",
    "email": "2303a52353@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52378",
    "name": "DAVUPATI PREETHI",
    "email": "2303a52378@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52399",
    "name": "GADDAM BHANU PRAKASH REDDY",
    "email": "2303a52399@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52402",
    "name": "KOMMINI HARIHARAN",
    "email": "2303a52402@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52422",
    "name": "ALUGURI HARSHITH",
    "email": "2303a52422@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52441",
    "name": "NEMALIPURI AKSHAYA",
    "email": "2303a52441@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52467",
    "name": "BATTU VENKATESH",
    "email": "2303a52467@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB37"
  },
  {
    "id": "2303A52019",
    "name": "BAYYA SANJANA",
    "email": "2303a52019@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52020",
    "name": "BEEMAGONI VARUN",
    "email": "2303a52020@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52021",
    "name": "BELLAMKONDA BHANUPRASAD",
    "email": "2303a52021@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52022",
    "name": "GADDAMEEDI VUNITH KUMAR",
    "email": "2303a52022@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52023",
    "name": "GUNDEKARI YESHASHWINI",
    "email": "2303a52023@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52024",
    "name": "JUNNU BHAKTHI YADAV",
    "email": "2303a52024@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52025",
    "name": "KANDAGATLA SAI ROHAN",
    "email": "2303a52025@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52026",
    "name": "KARAMPURI AKSHITHA",
    "email": "2303a52026@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52027",
    "name": "KURMILLA KEERTHANA",
    "email": "2303a52027@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52028",
    "name": "LAKKIREDDY ARAVIND REDDY",
    "email": "2303a52028@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52033",
    "name": "SRI LAXMI GAYATHRI BODLA",
    "email": "2303a52033@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52034",
    "name": "SRINITHYA KOUDAGANI",
    "email": "2303a52034@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52035",
    "name": "VADIYALA VISHNU DATTU",
    "email": "2303a52035@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52050",
    "name": "THODUPUNURI HIMABINDHU",
    "email": "2303a52050@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52152",
    "name": "GUNISHETTY SUKRUTI",
    "email": "2303a52152@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52327",
    "name": "ESLAVATH SANJAY",
    "email": "2303a52327@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52344",
    "name": "MAMIDALA SHIVAMANI",
    "email": "2303a52344@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52355",
    "name": "TADOORU GNANA PRAKASH",
    "email": "2303a52355@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52362",
    "name": "CHIRRA PUSHKAR",
    "email": "2303a52362@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52368",
    "name": "DOWLAGHAR HIMESH",
    "email": "2303a52368@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52401",
    "name": "RAVULA SAI ASHRITHA",
    "email": "2303a52401@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52406",
    "name": "KONDAPAKA TEJASWI",
    "email": "2303a52406@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52410",
    "name": "VEETALA SAI NITHISH",
    "email": "2303a52410@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52425",
    "name": "POSHALA HARSHITH",
    "email": "2303a52425@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52434",
    "name": "VEERLA SATHVIKA",
    "email": "2303a52434@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52443",
    "name": "MALYALA SIDDHARTHA",
    "email": "2303a52443@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52475",
    "name": "GANGU VENKATA SHIVA YAMINI",
    "email": "2303a52475@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52477",
    "name": "NAKKA NIKHIL",
    "email": "2303a52477@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52488",
    "name": "CHINTHALAPALLY SHIVA SAI",
    "email": "2303a52488@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52490",
    "name": "KANNAM ADITHYA",
    "email": "2303a52490@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB38"
  },
  {
    "id": "2303A52051",
    "name": "BIRUDARAJU SRISHANTH RAJU",
    "email": "2303a52051@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52052",
    "name": "CHITTIREDDY SHIVANI",
    "email": "2303a52052@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52053",
    "name": "EDLA HASINI",
    "email": "2303a52053@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52054",
    "name": "GANGULA VARSHITHA",
    "email": "2303a52054@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52055",
    "name": "JAGARLAPUDI RADHA KRISHNA",
    "email": "2303a52055@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52056",
    "name": "JAKKULA SRI VAISHNAVI",
    "email": "2303a52056@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52057",
    "name": "MALLEPULA OM PRAKASH GOUD",
    "email": "2303a52057@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52058",
    "name": "MEGHA AKANKSHA GOPISHETTY",
    "email": "2303a52058@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52059",
    "name": "MOHAMMED KAIF MUQEED",
    "email": "2303a52059@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52060",
    "name": "MUTHYALA BHARATH",
    "email": "2303a52060@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52061",
    "name": "PUPPALA MUKESH BABU",
    "email": "2303a52061@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52063",
    "name": "VODAPELLI NAGESHWARI",
    "email": "2303a52063@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52078",
    "name": "VADICHERLA ASMITHA",
    "email": "2303a52078@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52079",
    "name": "BANDA SHIVAMANI",
    "email": "2303a52079@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52080",
    "name": "GORLA SRISHANTH",
    "email": "2303a52080@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52081",
    "name": "GUDIKANDULA PRASHANTH",
    "email": "2303a52081@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52083",
    "name": "HUMERA NUZHAT",
    "email": "2303a52083@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52084",
    "name": "KONTHAM SATHWIKA",
    "email": "2303a52084@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52331",
    "name": "VEERLA NAGA SAI SNEHITHA",
    "email": "2303a52331@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52342",
    "name": "NARIGE CHANDANA PRIYA",
    "email": "2303a52342@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52363",
    "name": "BAKKERA NAVYA SRI",
    "email": "2303a52363@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52381",
    "name": "SYEDA HAFSA FATHIMA",
    "email": "2303a52381@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52383",
    "name": "VEERAPANENI NEHAL",
    "email": "2303a52383@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52396",
    "name": "MEKALA MANOGNA",
    "email": "2303a52396@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52427",
    "name": "PULLURI HARI CHARAN GUPTA",
    "email": "2303a52427@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52445",
    "name": "ELLENKI PAVANI",
    "email": "2303a52445@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52450",
    "name": "SHABOTHU VRISHANK",
    "email": "2303a52450@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52461",
    "name": "VAINALA DEEKSHITHA",
    "email": "2303a52461@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52463",
    "name": "VELISHOJU SIDDHARTHA",
    "email": "2303a52463@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52474",
    "name": "KESHOJU SRINIJA",
    "email": "2303a52474@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB39"
  },
  {
    "id": "2303A52085",
    "name": "MADIKONDA HARSHA VARDHAN RAO",
    "email": "2303a52085@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52087",
    "name": "MANDALA VARSHITH REDDY",
    "email": "2303a52087@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52088",
    "name": "MUNJA SANGEETHA",
    "email": "2303a52088@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52089",
    "name": "NANDIKONDA ASHWITHA REDDY",
    "email": "2303a52089@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52090",
    "name": "PANNATI SAMANVITH",
    "email": "2303a52090@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52091",
    "name": "KOKKONDA NIVEDHITHA",
    "email": "2303a52091@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52094",
    "name": "BOLLAM LAXMI SPANDANA",
    "email": "2303a52094@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52108",
    "name": "ALAHARI CHARANI",
    "email": "2303a52108@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52110",
    "name": "AMEDA ROHITH",
    "email": "2303a52110@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52111",
    "name": "ASHMITHA REDDY RAKKI REDDY",
    "email": "2303a52111@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52113",
    "name": "JEEGARI ADITYA",
    "email": "2303a52113@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52114",
    "name": "KOTHAKONDA SNEHAL",
    "email": "2303a52114@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52115",
    "name": "NADIPELLI JYOTHI",
    "email": "2303a52115@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52116",
    "name": "NAGIREDDY AKSHITHA",
    "email": "2303a52116@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52117",
    "name": "NALLALA MADHUVANI",
    "email": "2303a52117@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52118",
    "name": "POCHAMPALLY SRAVAN",
    "email": "2303a52118@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52119",
    "name": "PUJARI RUSHIK",
    "email": "2303a52119@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52123",
    "name": "BETHOJU TEJASWI",
    "email": "2303a52123@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52218",
    "name": "KANAPARTHY VRUSHIKESH",
    "email": "2303a52218@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52219",
    "name": "MACHARLA SHARVANI",
    "email": "2303a52219@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52336",
    "name": "P SREE VARSHINI",
    "email": "2303a52336@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52338",
    "name": "CHITYALA RAHUL",
    "email": "2303a52338@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52340",
    "name": "AITHA SIDDARTHA",
    "email": "2303a52340@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52358",
    "name": "KARRE SUCHITHA REDDY",
    "email": "2303a52358@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52367",
    "name": "KANDHI CHARAN YADAV",
    "email": "2303a52367@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52372",
    "name": "VURUGONDA PREETHAM REDDY",
    "email": "2303a52372@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52386",
    "name": "JAKKULA THARUN",
    "email": "2303a52386@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52458",
    "name": "MANTHOJU NAGA CHAITANYA",
    "email": "2303a52458@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52466",
    "name": "SAMEERA ANJUM",
    "email": "2303a52466@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52491",
    "name": "PAMBIDI ASHISH RAO",
    "email": "2303a52491@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB40"
  },
  {
    "id": "2303A52135",
    "name": "GANTA SAI TEJA",
    "email": "2303a52135@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52136",
    "name": "THADEM RAMYA SRI",
    "email": "2303a52136@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52137",
    "name": "PENDEM CHITHRA",
    "email": "2303a52137@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52138",
    "name": "PILUMARI CHARAN KUMAR",
    "email": "2303a52138@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52139",
    "name": "KOLIPAKA SANJANA",
    "email": "2303a52139@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52140",
    "name": "CHIDHURALLA ROHITH REDDY",
    "email": "2303a52140@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52141",
    "name": "BONAGIRI POOJA",
    "email": "2303a52141@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52142",
    "name": "BAISA VAISHNAVI",
    "email": "2303a52142@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52144",
    "name": "KETHIREDDY LIKITHA",
    "email": "2303a52144@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52145",
    "name": "MUSKU SIVATEJA",
    "email": "2303a52145@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52146",
    "name": "VEERAMALLA PRANEETH REDDY",
    "email": "2303a52146@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52147",
    "name": "SYED YAKUB",
    "email": "2303a52147@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52148",
    "name": "GADE MANISH ARANDEEP REDDY",
    "email": "2303a52148@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52151",
    "name": "VADNALA SHIVA KRISHNA",
    "email": "2303a52151@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52153",
    "name": "KEERTHI DHANA SRI",
    "email": "2303a52153@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52170",
    "name": "OJHA ARCHITHA",
    "email": "2303a52170@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52171",
    "name": "GUJJA PRANITHA",
    "email": "2303a52171@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52172",
    "name": "PAMBIDI SHIVANI",
    "email": "2303a52172@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52173",
    "name": "KOLLOJU SAI PRANEETH",
    "email": "2303a52173@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52174",
    "name": "VOLLALA ABHINAV",
    "email": "2303a52174@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52175",
    "name": "ADARASANI VEEKSHITHA",
    "email": "2303a52175@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52176",
    "name": "YERUVA RISHWANTH REDDY",
    "email": "2303a52176@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52339",
    "name": "GODISHALA KRUTHIK ROSHAN",
    "email": "2303a52339@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52354",
    "name": "VALABOJU HARSHAVARDHANU",
    "email": "2303a52354@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52400",
    "name": "DAYYALA VIDHU SREE",
    "email": "2303a52400@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52439",
    "name": "KANJARLA VIGNANAND RAO",
    "email": "2303a52439@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52446",
    "name": "THEEGALA MOHANA",
    "email": "2303a52446@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52460",
    "name": "MANUPATI VIVEK",
    "email": "2303a52460@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52481",
    "name": "KATAKAM SINDHU",
    "email": "2303a52481@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52486",
    "name": "VAJINAPALLI ABHINAV",
    "email": "2303a52486@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB41"
  },
  {
    "id": "2303A52179",
    "name": "PAINDLA DEEPAK",
    "email": "2303a52179@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52180",
    "name": "PAKA MOURYA RAJ",
    "email": "2303a52180@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52181",
    "name": "JEEJULA PRUTHVI RAJ",
    "email": "2303a52181@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52184",
    "name": "GULLAPELLI PREETHAM",
    "email": "2303a52184@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52222",
    "name": "ADINA ISRAN",
    "email": "2303a52222@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52223",
    "name": "KARRA SAI KUMAR REDDY",
    "email": "2303a52223@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52224",
    "name": "RIDA SHIREEN",
    "email": "2303a52224@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52230",
    "name": "SALUPALA NAVEEN YADAV",
    "email": "2303a52230@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52253",
    "name": "DANDE HAVISH",
    "email": "2303a52253@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52282",
    "name": "APPANAPALLI DURGA VENKATA VINAY SAI RAM",
    "email": "2303a52282@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52284",
    "name": "D VENU MADHAV",
    "email": "2303a52284@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52288",
    "name": "KARUPOTHULA DINESH",
    "email": "2303a52288@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52291",
    "name": "MUSHIKE SHASHIDHAR",
    "email": "2303a52291@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52293",
    "name": "NEREDU MANOTEJ",
    "email": "2303a52293@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52294",
    "name": "PANCHAKOTI AYUSHMAN",
    "email": "2303a52294@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52300",
    "name": "KANDUBOTHU JASWANTH",
    "email": "2303a52300@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52304",
    "name": "VYAKARANAM HRK SRI HARSHA VIGNESH",
    "email": "2303a52304@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52307",
    "name": "YESI REDDY PRANITH SAI",
    "email": "2303a52307@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52310",
    "name": "KURIMELLA LAXMI PRASANNA",
    "email": "2303a52310@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52333",
    "name": "PINDI SHARANYA REDDY",
    "email": "2303a52333@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52379",
    "name": "ADHI RISHWANTH",
    "email": "2303a52379@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52394",
    "name": "SYED NAZIYA PARVEEN",
    "email": "2303a52394@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52414",
    "name": "PIKKILI SHREEMUKHI",
    "email": "2303a52414@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52432",
    "name": "AVIRENDLA YASHWANTH",
    "email": "2303a52432@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52452",
    "name": "CHINTALA ANUKYA REDDY",
    "email": "2303a52452@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52453",
    "name": "ANYAM AKSHITHA",
    "email": "2303a52453@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52468",
    "name": "BERELLI PRIYANKA",
    "email": "2303a52468@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52472",
    "name": "BANDAPELLY DHANUSH",
    "email": "2303a52472@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52478",
    "name": "SAMUDRALA RAJ KUMAR",
    "email": "2303a52478@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB42"
  },
  {
    "id": "2303A52008",
    "name": "KOTHIMIR KAR KEERTHAN",
    "email": "2303a52008@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52082",
    "name": "GUNISETTI BHARATH NAGA SATYA KUMAR",
    "email": "2303a52082@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52086",
    "name": "MANDALA RISHIDHAR REDDY",
    "email": "2303a52086@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52205",
    "name": "CHALLA HASINI",
    "email": "2303a52205@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52206",
    "name": "CHENCHU RAJU",
    "email": "2303a52206@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52208",
    "name": "INUKURTHI NIPUN",
    "email": "2303a52208@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52211",
    "name": "ANUPOJU HARSHITA LAKSHMI NAGA DURGA",
    "email": "2303a52211@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52213",
    "name": "JOUDI SHASHANK REDDY",
    "email": "2303a52213@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52248",
    "name": "RAMANNAGARI PRANITHA REDDY",
    "email": "2303a52248@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52249",
    "name": "ADAPALA VAMSHI KRISHNA",
    "email": "2303a52249@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52250",
    "name": "CH MANIVARDHAN",
    "email": "2303a52250@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52251",
    "name": "CHERUKUPALLY SANHITH REDDY",
    "email": "2303a52251@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52252",
    "name": "CHIDURALA NITHIN DATTA REDDY",
    "email": "2303a52252@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52255",
    "name": "GADDAM SAI",
    "email": "2303a52255@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52256",
    "name": "KOTA SIRI CHANDANA",
    "email": "2303a52256@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52262",
    "name": "SILIVERU ROHITH",
    "email": "2303a52262@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52270",
    "name": "JANNARAM YESHWANTH REDDY",
    "email": "2303a52270@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52276",
    "name": "MAMIDALA GEETHIKA",
    "email": "2303a52276@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52281",
    "name": "THANGALLAPALLY VIKAS",
    "email": "2303a52281@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52285",
    "name": "GADDAM SRINIDHI",
    "email": "2303a52285@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52292",
    "name": "MYDAM SANJANA",
    "email": "2303a52292@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52306",
    "name": "BIKKINENI SANJANA",
    "email": "2303a52306@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52308",
    "name": "RUPALI",
    "email": "2303a52308@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52369",
    "name": "PIDUGU LAVAN KUMAR",
    "email": "2303a52369@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52380",
    "name": "BODDIREDDY MANUDEEP REDDY",
    "email": "2303a52380@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52392",
    "name": "KHANAPURAM SAI RAHUL",
    "email": "2303a52392@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52393",
    "name": "PENDLI LIKITHA",
    "email": "2303a52393@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52395",
    "name": "PAPPULA SAI",
    "email": "2303a52395@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52444",
    "name": "KOLLURI SUNNY",
    "email": "2303a52444@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52469",
    "name": "GATTU ABHISHEK",
    "email": "2303a52469@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB43"
  },
  {
    "id": "2303A52006",
    "name": "KAKKERLA SAI SNEHITH",
    "email": "2303a52006@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52030",
    "name": "PANUGANTI INDUVARDHAN REDDY",
    "email": "2303a52030@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52043",
    "name": "PORANDLA MANOJ",
    "email": "2303a52043@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52068",
    "name": "KANTHALA RISHITH REDDY",
    "email": "2303a52068@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52130",
    "name": "VANGA MANIKANTA VARA PRASAD",
    "email": "2303a52130@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52134",
    "name": "ARJUN MANOJ",
    "email": "2303a52134@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52188",
    "name": "PURELLA SUSHMA",
    "email": "2303a52188@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52190",
    "name": "MORA VIKAS",
    "email": "2303a52190@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52231",
    "name": "SHAIK SOHAIL PASHA",
    "email": "2303a52231@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52241",
    "name": "ADDAGUDI MANIDEEP",
    "email": "2303a52241@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52260",
    "name": "RYAKAM NIKHIL KUMAR",
    "email": "2303a52260@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52290",
    "name": "MOLLGURI JAGADEESH",
    "email": "2303a52290@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52335",
    "name": "VALLURI RACHANA",
    "email": "2303a52335@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52343",
    "name": "ENJAMURI SRIVARSHA",
    "email": "2303a52343@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52345",
    "name": "KANNEBOYINA MEGHANA",
    "email": "2303a52345@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52348",
    "name": "RAVULA ABHINAV REDDY",
    "email": "2303a52348@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52360",
    "name": "NARENDRULA SOURISH",
    "email": "2303a52360@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52370",
    "name": "RAVULA AJAY",
    "email": "2303a52370@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52373",
    "name": "KASIDI DEEKSHITH REDDY",
    "email": "2303a52373@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52389",
    "name": "PAIDIPELLY VISHWATEJA",
    "email": "2303a52389@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52391",
    "name": "PENNA BHARGAVI",
    "email": "2303a52391@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52398",
    "name": "CHALUVAJI SRINIDH RAO",
    "email": "2303a52398@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52405",
    "name": "NAKKALA VAISHNAVI",
    "email": "2303a52405@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52412",
    "name": "SAMBARAJU SRIJA",
    "email": "2303a52412@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52430",
    "name": "KANNEBOINA UMAMAHESHWARI",
    "email": "2303a52430@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52436",
    "name": "KODITHYALA AKSHITH",
    "email": "2303a52436@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52459",
    "name": "SARAB RAJESH",
    "email": "2303a52459@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52480",
    "name": "KAMATAM SHIVA TEJA",
    "email": "2303a52480@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52482",
    "name": "ADLURI VIVEK CHARAN",
    "email": "2303a52482@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52483",
    "name": "REVURI NAVYA",
    "email": "2303a52483@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB44"
  },
  {
    "id": "2303A52009",
    "name": "LAKUM VIVEK",
    "email": "2303a52009@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52062",
    "name": "VELPULA SIDDARTHA",
    "email": "2303a52062@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52112",
    "name": "GUDLA SARANYA",
    "email": "2303a52112@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52154",
    "name": "VATTOLI SAI KRISHNA CHAITHANYA",
    "email": "2303a52154@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52169",
    "name": "BANDI HANUSH VARDHAN",
    "email": "2303a52169@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52185",
    "name": "ATHIQA",
    "email": "2303a52185@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52203",
    "name": "CHANDUPATLA VAISHNAV REDDY",
    "email": "2303a52203@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52216",
    "name": "KOLA ASHWITHA",
    "email": "2303a52216@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52217",
    "name": "MOHAMMED ABDUL LAYEEQ",
    "email": "2303a52217@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52258",
    "name": "PANJALA ARCHITH",
    "email": "2303a52258@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52259",
    "name": "PUNNAM HEMANTH",
    "email": "2303a52259@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52264",
    "name": "VADLURI VEDHARTH",
    "email": "2303a52264@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52265",
    "name": "VANAPARTHI THARUN",
    "email": "2303a52265@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52283",
    "name": "BALAJI PRIYAMVADA SINGH",
    "email": "2303a52283@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52295",
    "name": "REDDI KARUNA KUMARI",
    "email": "2303a52295@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52297",
    "name": "SUDIREDDY ASRITHA CHOWDARY",
    "email": "2303a52297@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52299",
    "name": "ADDAGATLA SAI SHREHAN",
    "email": "2303a52299@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52302",
    "name": "VALABOJU HARINADH",
    "email": "2303a52302@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52305",
    "name": "KATKURI SAI KRISHNA REDDY",
    "email": "2303a52305@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52313",
    "name": "CHOPPARA SANJU",
    "email": "2303a52313@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52315",
    "name": "MUTPUR AKHIL REDDY",
    "email": "2303a52315@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52316",
    "name": "BALLE SAI AKSHITH",
    "email": "2303a52316@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52320",
    "name": "KACHHAPAGA HEMANTH KUMAR",
    "email": "2303a52320@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52324",
    "name": "GUNDA SNEHITH",
    "email": "2303a52324@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52329",
    "name": "ALLI DINESH",
    "email": "2303a52329@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52346",
    "name": "KOTHA SUJITH",
    "email": "2303a52346@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52350",
    "name": "KALLEPU MOUNIKA",
    "email": "2303a52350@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52376",
    "name": "GUVVA VAISHNAVI",
    "email": "2303a52376@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52382",
    "name": "KESHIREDDY VEDA SRI",
    "email": "2303a52382@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52438",
    "name": "TEEGALA RISHITHA",
    "email": "2303a52438@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB45"
  },
  {
    "id": "2303A52447",
    "name": "CHIDURALA VINEETH",
    "email": "2303a52447@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52451",
    "name": "DIDDI KRISHNA SATHWIKA",
    "email": "2303a52451@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52465",
    "name": "MALLADI AVINASH",
    "email": "2303a52465@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52492",
    "name": "SUNKARI SAI",
    "email": "2303a52492@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52493",
    "name": "RIMSHA NAAZ",
    "email": "2303a52493@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52494",
    "name": "CHUKKA VARSHA SRI",
    "email": "2303a52494@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52495",
    "name": "THIRUNAHARI PRASHANTHI",
    "email": "2303a52495@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52496",
    "name": "SYED ALTHAF",
    "email": "2303a52496@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52497",
    "name": "MEKALA SAIRITHWIK REDDY",
    "email": "2303a52497@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52499",
    "name": "DASAVARAM NIHAAL KRISHNA",
    "email": "2303a52499@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52501",
    "name": "RAVULA SAHASTRA",
    "email": "2303a52501@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52502",
    "name": "PAPPALA SAI SHANKAR",
    "email": "2303a52502@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52503",
    "name": "RANGA SATYANARAYANA",
    "email": "2303a52503@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52504",
    "name": "THAKKALAPALLY ABHIRAM",
    "email": "2303a52504@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A52505",
    "name": "SHAESTHA KOWNAIN",
    "email": "2303a52505@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2403A52L01",
    "name": "ANTHATI AKHIL",
    "email": "2403a52l01@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2403A52L02",
    "name": "NALUBOLA SAI KOUSHIK",
    "email": "2403a52l02@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2403A52L03",
    "name": "ALAKUNTLA SANDEEP",
    "email": "2403a52l03@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2403A52L04",
    "name": "KUKATLA AKHIRANANADAN",
    "email": "2403a52l04@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2403A52L05",
    "name": "MOLUGURI RAM",
    "email": "2403a52l05@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB50"
  },
  {
    "id": "2303A53001",
    "name": "KATHYAYANI M CHOUDHARI",
    "email": "2303a53001@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53002",
    "name": "KOLLI PRANAY CHOWDARY",
    "email": "2303a53002@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53003",
    "name": "VEMULA ALOK",
    "email": "2303a53003@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53004",
    "name": "AYREDDY AKANKSHA",
    "email": "2303a53004@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53006",
    "name": "DUSSA SURAJ",
    "email": "2303a53006@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53009",
    "name": "VALLAPU SRIRAM",
    "email": "2303a53009@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53010",
    "name": "GOLI AKASH",
    "email": "2303a53010@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53011",
    "name": "SHAIK FAZAL",
    "email": "2303a53011@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53012",
    "name": "BANDLA SANGEETH",
    "email": "2303a53012@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53013",
    "name": "ERRAMSETTI SAI VIGNESH",
    "email": "2303a53013@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53014",
    "name": "GOLI DEVADAS",
    "email": "2303a53014@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53015",
    "name": "MOHAMMED FAISAL QURESHI",
    "email": "2303a53015@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53016",
    "name": "KUNCHIPARTHI JYOSHNO PRANAV",
    "email": "2303a53016@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53017",
    "name": "NANDYALA JASHWANTH REDDY",
    "email": "2303a53017@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53018",
    "name": "BANDAM AKARSH",
    "email": "2303a53018@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53019",
    "name": "FARTUN MOHAMED FARAH",
    "email": "2303a53019@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53020",
    "name": "BOLLU SHIVA KUMAR",
    "email": "2303a53020@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53021",
    "name": "MADDELA PARAMESH",
    "email": "2303a53021@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53022",
    "name": "BOREDDY MEGHANA REDDY",
    "email": "2303a53022@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53023",
    "name": "GUTHA SRINIDHI",
    "email": "2303a53023@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53024",
    "name": "TELJEERU AKHIL",
    "email": "2303a53024@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53025",
    "name": "BODDIREDDY SHIVANI",
    "email": "2303a53025@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53026",
    "name": "MAHESHWARAPU ABHIRAM",
    "email": "2303a53026@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53027",
    "name": "BANDARI KAVYA",
    "email": "2303a53027@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53028",
    "name": "BAJJURI AKSHITH",
    "email": "2303a53028@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53029",
    "name": "GARV KUMAR",
    "email": "2303a53029@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53030",
    "name": "HUMERA MAHAVEEN",
    "email": "2303a53030@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53031",
    "name": "ADITYA RAJ",
    "email": "2303a53031@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53032",
    "name": "CHUNCHU NITHIN",
    "email": "2303a53032@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53033",
    "name": "MAMIDALA ANIRUDH KUMAR",
    "email": "2303a53033@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53034",
    "name": "OM KARAM NARASIMHA RAJU",
    "email": "2303a53034@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53035",
    "name": "UKANTI PRANAV",
    "email": "2303a53035@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53036",
    "name": "BONGONI DEVENDAR GOUD",
    "email": "2303a53036@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53037",
    "name": "MOHAMMED KHAJA SAMEERUDDIN",
    "email": "2303a53037@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53038",
    "name": "P HARSHA VARDHAN",
    "email": "2303a53038@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53039",
    "name": "PARUCHURI SAI VENKATESH",
    "email": "2303a53039@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53040",
    "name": "ANAGANDULA GOUTHAMI",
    "email": "2303a53040@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A53041",
    "name": "MODEM PUNNAM CHANDRAH",
    "email": "2303a53041@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2403A53L01",
    "name": "DOUTHUBAJI NAVEEN",
    "email": "2403a53l01@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2403A53L02",
    "name": "SUDDALA VARUN",
    "email": "2403a53l02@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB46"
  },
  {
    "id": "2303A54001",
    "name": "RATNAM SANJAY",
    "email": "2303a54001@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54004",
    "name": "MUDIGANTI RUCHITHA",
    "email": "2303a54004@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54006",
    "name": "CHINNALA CHARAN KUMAR",
    "email": "2303a54006@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54007",
    "name": "SOUDU SRILATHA",
    "email": "2303a54007@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54008",
    "name": "CHEELA ABHINAV REDDY",
    "email": "2303a54008@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54012",
    "name": "ADEPU SANJAY",
    "email": "2303a54012@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54013",
    "name": "BAIREDDY HASINI",
    "email": "2303a54013@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54015",
    "name": "POCHAMPALLI AKSHITH",
    "email": "2303a54015@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54019",
    "name": "ALUGU MANOHAR",
    "email": "2303a54019@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54021",
    "name": "DASI MAHESH",
    "email": "2303a54021@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54028",
    "name": "ERUKULLA MAHANTH ARYA",
    "email": "2303a54028@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54035",
    "name": "MUCHU LEENA SAI",
    "email": "2303a54035@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54043",
    "name": "ROUNAK RAJ",
    "email": "2303a54043@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54046",
    "name": "BAIRI UDAY KUMAR",
    "email": "2303a54046@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54047",
    "name": "ARRAM SANTHOSHINI REDDY",
    "email": "2303a54047@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54049",
    "name": "MITTAPALLY YASHASWINI",
    "email": "2303a54049@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54050",
    "name": "ADDAGUDI PUSHPANJALI",
    "email": "2303a54050@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54051",
    "name": "MOHAMMED MUQTADIR ALI",
    "email": "2303a54051@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54052",
    "name": "PERUMANDLA MANI SAI",
    "email": "2303a54052@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54053",
    "name": "SHAIK NAVED AHMED",
    "email": "2303a54053@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54054",
    "name": "AELISHALA MANOJ",
    "email": "2303a54054@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54055",
    "name": "VADLAKONDA SUSHMITHA",
    "email": "2303a54055@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54056",
    "name": "ALLURI NAVANEETH",
    "email": "2303a54056@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54058",
    "name": "GUMUDAVELLI THRUSHITHA",
    "email": "2303a54058@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54059",
    "name": "SYED MASHOOD ADNAAN",
    "email": "2303a54059@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54060",
    "name": "KAPPAGANTI SRIMUKHI",
    "email": "2303a54060@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54061",
    "name": "NUMERA MAHVEEN",
    "email": "2303a54061@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54062",
    "name": "NAGUNTI ANANTHAN",
    "email": "2303a54062@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54064",
    "name": "GANGULA TEJOMAYI",
    "email": "2303a54064@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54067",
    "name": "PATHLAVATH SRINIVAS",
    "email": "2303a54067@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB47"
  },
  {
    "id": "2303A54002",
    "name": "ERUKULLA THARUNI",
    "email": "2303a54002@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54010",
    "name": "THIMEERISHETTI VASAVI",
    "email": "2303a54010@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54011",
    "name": "GADI POOJITHA SHARINI",
    "email": "2303a54011@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54017",
    "name": "DUDDUKURI UDAYAN",
    "email": "2303a54017@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54022",
    "name": "GREESHMA RAJALA",
    "email": "2303a54022@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54023",
    "name": "KAREDHA SRIJA",
    "email": "2303a54023@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54025",
    "name": "THAKUR SHIVASAI",
    "email": "2303a54025@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54027",
    "name": "SONNAYILA TEJASWINI",
    "email": "2303a54027@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54036",
    "name": "MUPKAL SANJAY",
    "email": "2303a54036@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54037",
    "name": "SHINDE ANJALI",
    "email": "2303a54037@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54038",
    "name": "SURAPAREDDY HASITHA VARSHINI",
    "email": "2303a54038@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54040",
    "name": "BASABATHINI SUSHMA SINDHU",
    "email": "2303a54040@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54041",
    "name": "PATHA AKASH",
    "email": "2303a54041@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54042",
    "name": "MOHAMMAD ADIL",
    "email": "2303a54042@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54044",
    "name": "RAJULAPATI GOVARDHAN SAI GANESH",
    "email": "2303a54044@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54045",
    "name": "BALLA MADHUVARMA",
    "email": "2303a54045@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54048",
    "name": "ANUMANDLA RITHIKA",
    "email": "2303a54048@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54057",
    "name": "BACHU TEJASWINI",
    "email": "2303a54057@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54063",
    "name": "MADUGULA SAI PALLAVI",
    "email": "2303a54063@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54065",
    "name": "BANDI SAI VARSHA",
    "email": "2303a54065@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A54066",
    "name": "B G SREEVANI",
    "email": "2303a54066@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB48"
  },
  {
    "id": "2303A58001",
    "name": "KATTAMREDDY BABY BRUNDA",
    "email": "2303a58001@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58002",
    "name": "PENDOTA SAI ABHINAV",
    "email": "2303a58002@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58003",
    "name": "THOUTI RESHMA",
    "email": "2303a58003@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58004",
    "name": "V S K KARTEEK NAMUDURI",
    "email": "2303a58004@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58005",
    "name": "CHINNADAMERA PRATHIK VARMA",
    "email": "2303a58005@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58006",
    "name": "THAKKALAPELLI SAITEJA",
    "email": "2303a58006@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58007",
    "name": "ALLENKI MANOGNA",
    "email": "2303a58007@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58008",
    "name": "VENNAPELLY VAMSHI",
    "email": "2303a58008@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58009",
    "name": "MD ZULFE AL AS",
    "email": "2303a58009@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58010",
    "name": "MOHAMMAD NEHA",
    "email": "2303a58010@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58011",
    "name": "BOINI ANKHITH",
    "email": "2303a58011@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58012",
    "name": "PULLAGURLA ABIJITHH REDDY",
    "email": "2303a58012@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58013",
    "name": "BOLLEPALLY SATYA SAKETH",
    "email": "2303a58013@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58014",
    "name": "BONAGIRI CHETANOJWALA",
    "email": "2303a58014@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58015",
    "name": "AKSHITHA THOUDISETTI",
    "email": "2303a58015@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58016",
    "name": "MURARISHETTY CHAITHANYA",
    "email": "2303a58016@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58017",
    "name": "ARELLY PALLAV SRI VATHSAV",
    "email": "2303a58017@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58018",
    "name": "THAKKALLAPALLY HASINI",
    "email": "2303a58018@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58019",
    "name": "THATIKONDA SANKETH",
    "email": "2303a58019@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58020",
    "name": "SHAIK KARISHMA",
    "email": "2303a58020@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58021",
    "name": "POKATOTI VAMSHI",
    "email": "2303a58021@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58022",
    "name": "NALLANI VIJAY VITTAL",
    "email": "2303a58022@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58023",
    "name": "KOPPULA DAIWIK",
    "email": "2303a58023@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58024",
    "name": "GALI CHARAN TEJ",
    "email": "2303a58024@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58025",
    "name": "J MITHRASON",
    "email": "2303a58025@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58026",
    "name": "GIRI THANU SRI",
    "email": "2303a58026@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58027",
    "name": "AELAKANTI NYNIKA",
    "email": "2303a58027@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58028",
    "name": "KANAJAM NIKHIL NAIDU",
    "email": "2303a58028@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58029",
    "name": "GOVULA GOUTHAM REDDY",
    "email": "2303a58029@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58030",
    "name": "BANDI SRIRAM REDDY",
    "email": "2303a58030@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58031",
    "name": "VUPPATHALLA THANISHKA",
    "email": "2303a58031@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58032",
    "name": "MODUGULA ANUVARDHAN",
    "email": "2303a58032@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2303A58033",
    "name": "AADITHIYA BINU ANTONY",
    "email": "2303a58033@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB49"
  },
  {
    "id": "2403A51L01",
    "name": "MOGILI HARSHITHA",
    "email": "2403a51l01@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L02",
    "name": "ATLA SREEJA",
    "email": "2403a51l02@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L03",
    "name": "IDULAPURAM SATHWIK RAJESHWARA CHARY",
    "email": "2403a51l03@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L04",
    "name": "PERUMANDLA SANJAY KUMAR",
    "email": "2403a51l04@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L05",
    "name": "CHITTIMALLA RAJA NARESH",
    "email": "2403a51l05@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L06",
    "name": "ERUKALA KEERTHANA",
    "email": "2403a51l06@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L07",
    "name": "PULI RISHI",
    "email": "2403a51l07@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L08",
    "name": "KONUGATI RUTHWIK BHAT",
    "email": "2403a51l08@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L09",
    "name": "BERI ROHAN",
    "email": "2403a51l09@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L10",
    "name": "BURRA SRUTHI",
    "email": "2403a51l10@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L11",
    "name": "MACHARLA NANI PRASAD",
    "email": "2403a51l11@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L12",
    "name": "MUKKERA MANIKANTA",
    "email": "2403a51l12@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L13",
    "name": "SUDDALA VARUN",
    "email": "2403a51l13@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L14",
    "name": "GIRUGULA VARSHINI",
    "email": "2403a51l14@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L15",
    "name": "BITLA GNANESHWAR",
    "email": "2403a51l15@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L16",
    "name": "POLU AKSHAYA",
    "email": "2403a51l16@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L17",
    "name": "SAMALA BHARATH",
    "email": "2403a51l17@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L18",
    "name": "ADEPU NAGASAI",
    "email": "2403a51l18@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L19",
    "name": "KONNE PAVAN KUMAR REDDY",
    "email": "2403a51l19@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L20",
    "name": "MOGILI HARSHITHA",
    "email": "2403a51l20@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L21",
    "name": "KATAKAM SANTHOSH KUMAR",
    "email": "2403a51l21@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L22",
    "name": "ALETI NAGA KOUSHIK",
    "email": "2403a51l22@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L23",
    "name": "REDDY SAI KOWSHIK",
    "email": "2403a51l23@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L24",
    "name": "PAINDLA VAMSHI",
    "email": "2403a51l24@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L25",
    "name": "DEVARA HEPSIBA",
    "email": "2403a51l25@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L26",
    "name": "PODISHETTI ESHWAR",
    "email": "2403a51l26@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L27",
    "name": "MOHAMMED HASHIR SAYAM HUSSAIN",
    "email": "2403a51l27@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L28",
    "name": "GUNDU VINAY",
    "email": "2403a51l28@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L29",
    "name": "MULUGU SRINATH",
    "email": "2403a51l29@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L30",
    "name": "REKULAPALLY AKASH REDDY",
    "email": "2403a51l30@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB51"
  },
  {
    "id": "2403A51L31",
    "name": "JUPAKA HARIKA",
    "email": "2403a51l31@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L32",
    "name": "KATTHERAPAKA DHANUSH KUMAR",
    "email": "2403a51l32@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L33",
    "name": "PALLE SARIKA",
    "email": "2403a51l33@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L34",
    "name": "PARISHA VYSHNAVI",
    "email": "2403a51l34@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L35",
    "name": "VEMULA RIKITH",
    "email": "2403a51l35@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L36",
    "name": "GUGULOTH SAMPATH KUMAR",
    "email": "2403a51l36@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L37",
    "name": "PEDDAMMA HARSHAVARDHAN",
    "email": "2403a51l37@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L38",
    "name": "PEDDAPALLI ABHINAV",
    "email": "2403a51l38@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L39",
    "name": "PENTAPURI YESHWANTH REDDY",
    "email": "2403a51l39@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L40",
    "name": "GUNDETI AKHILA",
    "email": "2403a51l40@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L41",
    "name": "SHANABOINA SANKEERTHANA",
    "email": "2403a51l41@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L42",
    "name": "PINNINTI SANWITHA",
    "email": "2403a51l42@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L43",
    "name": "AJMEERA GOUTHAM",
    "email": "2403a51l43@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L44",
    "name": "VEMUGANTI AMRUTH SAGAR",
    "email": "2403a51l44@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L45",
    "name": "BANDI VIVEK",
    "email": "2403a51l45@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L46",
    "name": "SRUNGARAPU SAI KUMAR",
    "email": "2403a51l46@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L47",
    "name": "AETURI VAMSHI KRISHNA",
    "email": "2403a51l47@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L48",
    "name": "MOLUGURI SHYAM",
    "email": "2403a51l48@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L49",
    "name": "JAKKULA HARSHITH YADAV",
    "email": "2403a51l49@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L50",
    "name": "BATHINI VISHAL",
    "email": "2403a51l50@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L51",
    "name": "AZMEERA THARUN",
    "email": "2403a51l51@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L52",
    "name": "PITTA MANIKANTA",
    "email": "2403a51l52@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  },
  {
    "id": "2403A51L53",
    "name": "NAMMI DHANUSH",
    "email": "2403a51l53@student.univ.edu",
    "role": "student",
    "department": "CSE",
    "batch": "23CSBTB52"
  }
];

export const allFaculty: User[] = [
];

export const courses: Course[] = [
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "AT001", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT002", studentId: "S002", studentName: "Maria Garcia", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT003", studentId: "S003", studentName: "David Chen", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "absent" },
  { id: "AT004", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-19", status: "present" },
  { id: "AT005", studentId: "S001", studentName: "Alex Thompson", courseId: "C002", courseName: "Machine Learning", date: "2024-03-18", status: "late" },
  { id: "AT006", studentId: "S004", studentName: "Emma Wilson", courseId: "C004", courseName: "Quantum Mechanics", date: "2024-03-18", status: "present" },
  { id: "AT007", studentId: "S005", studentName: "Ryan Patel", courseId: "C001", courseName: "Data Structures & Algorithms", date: "2024-03-18", status: "present" },
  { id: "AT008", studentId: "S005", studentName: "Ryan Patel", courseId: "C002", courseName: "Machine Learning", date: "2024-03-18", status: "absent" },
];

export const marksRecords: MarksRecord[] = [
  { id: "M001", studentId: "S001", studentName: "Alex Thompson", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 88, midterm: 82, assignment2: 90, final: 85, total: 86, grade: "A" },
  { id: "M002", studentId: "S001", studentName: "Alex Thompson", courseId: "C002", courseName: "Machine Learning", assignment1: 75, midterm: 78, assignment2: 80, final: 72, total: 76, grade: "B+" },
  { id: "M003", studentId: "S002", studentName: "Maria Garcia", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 92, midterm: 95, assignment2: 88, final: 91, total: 92, grade: "A+" },
  { id: "M004", studentId: "S003", studentName: "David Chen", courseId: "C003", courseName: "Linear Algebra", assignment1: 70, midterm: 65, assignment2: 72, final: 68, total: 69, grade: "B-" },
  { id: "M005", studentId: "S004", studentName: "Emma Wilson", courseId: "C004", courseName: "Quantum Mechanics", assignment1: 85, midterm: 88, assignment2: 82, final: 90, total: 87, grade: "A" },
  { id: "M006", studentId: "S005", studentName: "Ryan Patel", courseId: "C001", courseName: "Data Structures & Algorithms", assignment1: 60, midterm: 55, assignment2: 65, final: 58, total: 60, grade: "C" },
];

export const feeRecords: FeeRecord[] = [
  { id: "FE001", studentId: "S001", studentName: "Alex Thompson", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 17500, fine: 0, status: "paid", dueDate: "2024-08-15" },
  { id: "FE002", studentId: "S002", studentName: "Maria Garcia", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 10000, fine: 0, status: "partial", dueDate: "2024-08-15" },
  { id: "FE003", studentId: "S003", studentName: "David Chen", semester: "Fall 2024", tuitionFee: 15000, labFee: 1500, libraryFee: 500, totalFee: 17000, paidAmount: 0, fine: 500, status: "unpaid", dueDate: "2024-08-15" },
  { id: "FE004", studentId: "S004", studentName: "Emma Wilson", semester: "Fall 2024", tuitionFee: 15000, labFee: 2500, libraryFee: 500, totalFee: 18000, paidAmount: 18000, fine: 0, status: "paid", dueDate: "2024-08-15" },
  { id: "FE005", studentId: "S005", studentName: "Ryan Patel", semester: "Fall 2024", tuitionFee: 15000, labFee: 2000, libraryFee: 500, totalFee: 17500, paidAmount: 5000, fine: 200, status: "partial", dueDate: "2024-08-15" },
];

export const notifications: Notification[] = [
  { id: "N001", title: "Mid-term Exams Schedule", message: "Mid-term examinations will be held from March 25-29. Please check your timetable for details.", type: "urgent", date: "2024-03-15", read: false, targetRole: "all" },
  { id: "N002", title: "Library Hours Extended", message: "The library will remain open until 11 PM during exam week.", type: "info", date: "2024-03-14", read: true, targetRole: "all" },
  { id: "N003", title: "Fee Payment Reminder", message: "Last date for fee payment without fine is March 20. Please clear your dues.", type: "warning", date: "2024-03-13", read: false, targetRole: "student" },
  { id: "N004", title: "Faculty Meeting", message: "Monthly faculty meeting scheduled for March 22 at 3 PM in the conference hall.", type: "info", date: "2024-03-12", read: false, targetRole: "faculty" },
  { id: "N005", title: "New Course Added", message: "Advanced AI (CS501) has been added for the Spring 2025 semester.", type: "success", date: "2024-03-11", read: true, targetRole: "all" },
  { id: "N006", title: "Attendance Warning", message: "Students with attendance below 75% will not be allowed to sit for final exams.", type: "warning", date: "2024-03-10", read: false, targetRole: "student" },
];

export const timetable: TimetableEntry[] = [
  { id: "T001", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Monday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T002", courseCode: "CS401", courseName: "Machine Learning", day: "Monday", startTime: "11:00", endTime: "12:30", room: "Lab 201", facultyName: "Dr. Emily Davis" },
  { id: "T003", courseCode: "MATH201", courseName: "Linear Algebra", day: "Monday", startTime: "2:00", endTime: "3:00", room: "Room 105", facultyName: "Dr. Lisa Park" },
  { id: "T004", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Tuesday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T005", courseCode: "PHY301", courseName: "Quantum Mechanics", day: "Tuesday", startTime: "2:00", endTime: "3:30", room: "Room 402", facultyName: "Prof. Robert Kim" },
  { id: "T006", courseCode: "CS201", courseName: "Database Systems", day: "Wednesday", startTime: "9:00", endTime: "10:00", room: "Lab 102", facultyName: "Prof. James Anderson" },
  { id: "T007", courseCode: "CS401", courseName: "Machine Learning", day: "Wednesday", startTime: "11:00", endTime: "12:30", room: "Lab 201", facultyName: "Dr. Emily Davis" },
  { id: "T008", courseCode: "MATH301", courseName: "Probability & Statistics", day: "Thursday", startTime: "9:00", endTime: "10:30", room: "Room 205", facultyName: "Dr. Lisa Park" },
  { id: "T009", courseCode: "CS301", courseName: "Data Structures & Algorithms", day: "Friday", startTime: "9:00", endTime: "10:00", room: "Room 301", facultyName: "Prof. James Anderson" },
  { id: "T010", courseCode: "CS201", courseName: "Database Systems", day: "Friday", startTime: "2:00", endTime: "3:00", room: "Lab 102", facultyName: "Prof. James Anderson" },
];

// Stats for dashboards
export const adminStats = {
  totalStudents: 1250,
  totalFaculty: 85,
  totalCourses: 120,
  totalDepartments: 12,
  attendanceRate: 87,
  feeCollectionRate: 78,
  pendingFees: 245000,
  activeNotifications: 4,
};

export const monthlyAttendanceData = [
  { month: "Sep", rate: 92 },
  { month: "Oct", rate: 88 },
  { month: "Nov", rate: 85 },
  { month: "Dec", rate: 78 },
  { month: "Jan", rate: 90 },
  { month: "Feb", rate: 87 },
  { month: "Mar", rate: 89 },
];

export const departmentEnrollment = [
  { department: "Computer Science", students: 380 },
  { department: "Mathematics", students: 220 },
  { department: "Physics", students: 180 },
  { department: "Chemistry", students: 150 },
  { department: "Biology", students: 170 },
  { department: "English", students: 150 },
];

export const feeCollectionData = [
  { month: "Sep", collected: 450000, pending: 50000 },
  { month: "Oct", collected: 420000, pending: 80000 },
  { month: "Nov", collected: 480000, pending: 20000 },
  { month: "Dec", collected: 390000, pending: 110000 },
  { month: "Jan", collected: 460000, pending: 40000 },
  { month: "Feb", collected: 430000, pending: 70000 },
  { month: "Mar", collected: 470000, pending: 30000 },
];

export const gradeDistribution = [
  { grade: "A+", count: 45 },
  { grade: "A", count: 120 },
  { grade: "B+", count: 180 },
  { grade: "B", count: 210 },
  { grade: "B-", count: 150 },
  { grade: "C", count: 95 },
  { grade: "D", count: 40 },
  { grade: "F", count: 10 },
];
