WITH recentCommunications AS (
	SELECT 
    	IF(senderId = @currentUserId, receiverId, senderId) AS userId,
    	message,
    	sendAt
    FROM 
    	messages
    WHERE senderId = @currentUserId OR receiverId = @currentUserId
),
partitionUsers AS (
	SELECT 
    	 ROW_NUMBER() OVER (PARTITION BY userId ORDER BY sendAt DESC) AS rowNo,
    	 recentCommunications.*
    FROM 
    	recentCommunications
),
recentUserMsgs AS (
	SELECT
    	userId,
    	message,
    	sendAt
    FROM 
    	partitionUsers 
    WHERE partitionUsers.rowNo = 1
),
userData AS (
	SELECT 
    	users.id,
    	users.name,
    	users.profileImgUrl,
    	recentUserMsgs.sendAt,
    	recentUserMsgs.message
    FROM recentUserMsgs
    INNER JOIN users ON users.id = recentUserMsgs.userId
),
nonRecentUsers AS (
	SELECT 
    	users.id,
    	users.name,
    	users.profileImgUrl,
    	'' AS message,
    	'' AS sendAt
    FROM 
    	users 
    WHERE users.id NOT IN (SELECT userData.id FROM userData)
),
finalUser AS (
	(SELECT * FROM userData) UNION (SELECT * FROM nonRecentUsers)
)
SELECT
	finalUser.id,
    finalUser.name,
    finalUser.profileImgUrl,
    finalUser.message
FROM 
	finalUser
ORDER BY finalUser.sendAt DESC