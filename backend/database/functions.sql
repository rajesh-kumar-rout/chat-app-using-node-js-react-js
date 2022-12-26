SELECT
	tbl1.id,
    tbl1.name,
    tbl1.profileImgUrl,
    tbl1.message
FROM 
	(
    	SELECT
            ROW_NUMBER() OVER (PARTITION BY IF(messages.senderId = 1, messages.receiverId, messages.senderId) ORDER BY 			   messages.sendAt DESC) AS rowNo,
            users.id,
            users.name,
            users.profileImgUrl,
            messages.message,
            messages.sendAt
        FROM 
            users
        LEFT JOIN messages ON 
            (messages.senderId = users.id AND messages.receiverId = 1) OR
            (messages.receiverId = users.id AND messages.senderId = 1)
        WHERE users.id != 1
    ) AS tbl1
WHERE rowNo = 1
ORDER BY sendAt DESC
