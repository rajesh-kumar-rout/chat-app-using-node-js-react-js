CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(20) NOT NULL UNIQUE,
    "password" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "message" VARCHAR(255),
    "senderId" INTEGER,
    "receiverId" INTEGER,
    "sendAt" TIMESTAMP,
    
    FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
