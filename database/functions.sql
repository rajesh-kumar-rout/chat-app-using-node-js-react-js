CREATE FUNCTION "getUsers" ("currentUserId" INTEGER)
RETURNS TABLE (id INTEGER, name VARCHAR, "profileImgUrl" VARCHAR, message VARCHAR) 

LANGUAGE 'plpgsql'
AS 
$$
BEGIN
RETURN QUERY WITH "recentConnections" AS
(
     (SELECT "senderId" AS "userId", "sendAt", m1.message FROM messages AS m1 WHERE m1."receiverId" = "currentUserId") UNION
     (SELECT "receiverId" AS "userId", "sendAt", m2.message FROM messages AS m2 WHERE m2."senderId" = "currentUserId")
),
"recentConnectionGroup" AS 
(
    SELECT 
        "recentConnections".*, 
        ROW_NUMBER() OVER(PARTITION BY "recentConnections"."userId" ORDER BY "sendAt" DESC) AS "sNo" 
    FROM "recentConnections" 
),
"recentUser1" AS
(
    SELECT 
        "userId", 
        "sendAt", 
        "recentConnectionGroup"."message" 
    FROM "recentConnectionGroup" 
    WHERE "sNo" = 1 
    ORDER BY "recentConnectionGroup"."sendAt" DESC
),
"recentUsers" AS
(
    SELECT 
        users.id, 
        users.name, 
        users."profileImgUrl", 
        "recentUser1".message 
    FROM "recentUser1" 
    INNER JOIN users ON users.id = "recentUser1"."userId"
),
"otherUsers" AS
(
    SELECT 
        users.id, 
        users.name, 
        users."profileImgUrl",
        '' AS "message"
    FROM users 
    WHERE users.id NOT IN (SELECT "recentUsers".id FROM "recentUsers") AND users.id != "currentUserId"
),
"users" AS
(
    (SELECT * FROM "recentUsers") UNION ALL 
    (SELECT * FROM "otherUsers")
)
SELECT * FROM users;
END;
$$;
