Backend --> server.js\
Ligne 16 --> Remplacer ```origin: ["https://quiz-des-copains.netlify.app", "https://www.quiz-des-copains.netlify.app"],``` par ```origin: "http://localhost:5173",```\
Lignes 26 à 29 --> changer PORT par 3001 et le console.log tu mets ce que tu veux

Lancer backend avec ```node server.js```

===========================================

Frontend --> src/socket.ts\
Ligne 3 --> Remplacer ```import.meta.env.VITE_API_URL as string``` par ```"http://localhost:3001"```

Lancer frontend avec ```npm run dev```