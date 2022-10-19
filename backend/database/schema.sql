CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(30) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "profileImgUrl" VARCHAR(100),
    "profileImgId" VARCHAR(100),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "messages" (
    "id" SERIAL PRIMARY KEY,
    "message" VARCHAR(255),
    "senderId" INTEGER,
    "receiverId" INTEGER,
    "sendAt" TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

