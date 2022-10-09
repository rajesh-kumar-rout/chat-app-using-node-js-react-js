CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(30) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "profileImgUrl" VARCHAR(100) NOT NULL,
    "profileImgId" VARCHAR(100) NOT NULL,
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
    FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


SELECT users.id, users.name, users."profileImgUrl", message FROM ( SELECT DISTINCT ON ("userId") "userId", "sendAt", message FROM ( SELECT * FROM ( (SELECT "receiverId" AS "userId", "sendAt", message FROM messages WHERE "senderId" = 1) UNION (SELECT "senderId" AS "userId", "sendAt", message FROM messages WHERE "receiverId" = 1 ) ) AS "recentUsers" ORDER BY "sendAt" DESC ) AS "recentUsers" ) AS "recentUsers" INNER JOIN users ON users.id = "recentUsers"."userId" ORDER BY "sendAt" DESC