let chat = [
    {
        senderId: 1,
        receiverId: 2,
        message: "Good morning 1",
        sendAt: new Date("2022-10-09T05:03:00.722Z")
    },
    {
        senderId: 2,
        receiverId: 1,
        message: "Good morning 2",
        sendAt: new Date("2022-10-09T05:02:54.722Z")
    },
    {
        senderId: 1,
        receiverId: 3,
        message: "Good morning 3",
        sendAt: new Date("2022-10-09T05:02:58.722Z")
    },
    {
        senderId: 3,
        receiverId: 1,
        message: "Good morning 4",
        sendAt: new Date("2022-10-09T05:02:59.722Z")
    },
]

const users = [
    {
        name: "Rajesh Rout",
        id: 1
    },
    {
        name: "Ramesh",
        id: 2
    },
    {
        name: "Raj",
        id: 3
    },
]

let newChats = []

chat = chat
    .sort((o1, o2) => o2.sendAt - o1.sendAt)
    .map(chat => ({
        userId: chat.senderId === 1 ? chat.receiverId : chat.senderId,
        message: chat.message
    }))
    .forEach(chat => {
        if(!newChats.find(newChat => newChat.userId === chat.userId)){
            newChats.push(chat)
        }
    })


newChats = newChats.map(chat => {
    const user = users.find(user => user.id == chat.userId)
    return {
        id: user.id,
        name: user.name,
        message: chat.message
    }
})

console.log(newChats);

