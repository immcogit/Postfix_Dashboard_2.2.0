postfix-dashboard/
├── backend/
│   ├── .env.example          
│   ├── package.json
│   └── server.js             
│
├── frontend/
│   ├── .env.example          
│   ├── src/
│   │   ├── config/
│   │   │   └── index.ts      
│   │   ├── context/
│   │   │   └── AuthContext.tsx  
│   │   ├── services/
│   │   │   ├── apiService.ts    
│   │   │   └── authService.ts   
│   │   ├── components/
│   │   │   ├── AILogAnalysis.tsx      
│   │   │   ├── AllowedNetworks.tsx     
│   │   │   ├── Dashboard.tsx           
│   │   │   ├── ErrorBoundary.tsx      
│   │   │   ├── Login.tsx               
│   │   │   ├── MailLogTable.tsx        
│   │   │   ├── Pagination.tsx          
│   │   │   ├── RecentActivity.tsx      
│   │   │   ├── StatCard.tsx            
│   │   │   └── ... (other components remain same)
│   │   ├── App.tsx
│   │   ├── env.d.ts
│   │   └── types.ts
│   └── package.json
│
└── README.md