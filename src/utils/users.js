users = []

const addUser = ({id,username,room})=>{

    //clean the data
    username = username.trim().toLowerCase();
    room     = room.trim().toLowerCase();

    if(!username || !room) {
        return {
            error : 'Username or Room unavailable'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return {
            error:"Username already exists"
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id);

    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    const user = users.findIndex((user)=> user.id === id)

    console.log(user)

        return users[user];
}

const getUsersInRoom = (room)=>{

    return users.filter((user)=>{
        return user.room === room
    })
}

//console.log(addUser({id:1,username:"AP",room:"ALLO" }))
//console.log(addUser({id:2,username:"AP",room:"ALLo" }))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}