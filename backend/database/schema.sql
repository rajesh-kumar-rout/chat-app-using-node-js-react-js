CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(20) NOT NULL UNIQUE,
    "password" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "rooms" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(20),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "adminId" INTEGER,
    
    FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "roomMembers" (
    "userId" INTEGER,
    "roomId" INTEGER,
    "joinedAt" TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "msg" VARCHAR(255),
    "roomId" INTEGER,
    "userId" INTEGER,
    "sendAt" TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
