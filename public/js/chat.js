const socket = io()

const $messageForm = document.querySelector('#message-form');
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')

const $location = document.getElementById('find-location')

const $messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML

const $links = document.querySelector("#links")
const $linksTemplate = document.querySelector("#links-template").innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

socket.on('message',(textObj)=>{

    console.log(textObj);

    //Screen Printer.
    const html = Mustache.render(messageTemplate,{
        username:textObj.username,
        message:textObj.text,
        time :  moment(textObj.createdAt).format(" h:mm A ")
    });
    $messages.insertAdjacentHTML('beforeend',html)

})

socket.on('locationMessage',(maplinkObj)=>{
    console.log(maplinkObj)

    const html = Mustache.render($linksTemplate,{
        username:maplinkObj.username,
        url:maplinkObj.text,
        time:moment(maplinkObj.createdAt).format(" h:mm A ")
    })
    $messages.insertAdjacentHTML('beforeend',html)

    $messages.scrollTop = 999999;//$messages.scrollHeight;

    
})

socket.on('roomData', ({room, users})=>{
    console.log(room)
    console.log(users)

    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector("#sidebar").innerHTML = html


})

$messageForm.addEventListener('submit',(e)=>{
    
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled');
    var text = e.target.elements.message.value; //document.querySelector('message').value;
    
    socket.emit('sendMessage',text, (msg)=>{

        console.log("The message was emitted",msg);  

        $messageFormInput.value = '';    $messageFormInput.focus(); $messageFormButton.removeAttribute('disabled');     //clear, button-enable and focus
    });
})

$location.addEventListener('click',()=>{

    $location.setAttribute('disabled','disabled');  //button-disabled
    
    if(!navigator.geolocation)
    {   return alert("Geolocation not supported by current browser");   }

    navigator.geolocation.getCurrentPosition((pos)=>{

        var data = {latitude : pos.coords.latitude , longitude: pos.coords.longitude};
        socket.emit("sendLocation", data, ()=>{
            console.log("Location Share");

            $location.removeAttribute('disabled')   //button-enabled.
        });
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
});