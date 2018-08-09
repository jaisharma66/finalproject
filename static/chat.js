// Total messages
var total_messages = 0;

// Sets user's display name based on input
function disp_name()
{
    let disp_username = document.getElementById("disp_username").value;
    localStorage.setItem('disp_username', disp_username);
}

// Retrieves the name to be displayed
function retrieved_name()
{
    let showname = localStorage.getItem('disp_username');
    if (!localStorage.getItem('disp_username'))
        document.getElementById("displayname").innerHTML = "Type in Your Name";
    else
        document.getElementById("displayname").innerHTML = "Welcome, " + showname;
}

// Execute when all content is loaded
document.addEventListener('DOMContentLoaded', () =>
{
    // Loads sockets
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // On connect, this function configures the buttons and dropdowns
    socket.on('connect', () => {
        // Configures the send message button to emit a submit message
        document.querySelectorAll('#message_submit').forEach(button => {
            button.onclick = () => {
                var date = new Date();
                var name = localStorage.getItem('disp_username');
                var set_msg = document.querySelector('#message_box').value;
                var list = document.querySelector('#chn_name');
                var curr_channel = list.options[list.selectedIndex].value;
                socket.emit('submit message', {"date" : date.toString(), "name": name, "set_msg": set_msg, "curr_channel": curr_channel});
            };
        });

        // Configures the channel create button, gets the value from the message box and emits
        document.querySelectorAll('#button_create').forEach(button_2 => {
            button_2.onclick = () => {
                var channel_added = document.querySelector('#channel_input').value;
                socket.emit('channel added', channel_added);
            };
        });

        // Validates the connection and loads all channels
        socket.emit('connection validated');

        // Watches for a change in the select box and pulls messages from the correct channel
        document.querySelectorAll('#chn_name').forEach(item => {
            item.onchange = () => {
                const element_number = document.querySelector('#msgs_sent');
                while(element_number.firstChild)
                {
                    element_number.removeChild(element_number.firstChild);
                }
                var date = new Date();
                var name = localStorage.getItem('disp_username');
                var set_msg = document.querySelector('#message_box').value;
                var list_2 = document.querySelector('#chn_name');
                var curr_channel_2 = list_2.options[list_2.selectedIndex].value;
                localStorage.setItem('current_channel', curr_channel_2);
                socket.emit('current messaging', {"date" : date.toString(), "name": name, "set_msg": set_msg, "curr_channel": curr_channel_2});
            };
        });
    });

    // Returns the saved messages from a new channel that is selected
    socket.on('current messaging returned', passed_data => {
        var channel_list_msg = passed_data["channel_list_msg"];
        var data = passed_data["data"];
        var values = channel_list_msg[data["curr_channel"]];
        var values_passed = values.split(",");
        try
        {
            const element_number = document.querySelector('#msgs_sent');
            while(element_number.firstChild)
            {
                element_number.removeChild(element_number.firstChild);
            }
            for(var x = 0; x < values_passed.length; x++)
            {
                const msg_display = document.createElement('li');
                msg_display.innerHTML = `${data["name"]} : ${values[x]} - ${data["date"]}`;
                document.querySelector('#msgs_sent').append(msg_display);
            }
        }
        // Catches to make sure that all items are loaded correctly
        catch(err)
        {
            try
            {
                const element_number = document.querySelector('#msgs_sent');
                while(element_number.firstChild)
                {
                    element_number.removeChild(element_number.firstChild);
                }
            }
            catch(err2)
            {
                alert("All Messages Loaded!");
            }
        }
    });

    // Socket reloads all select boxes with new channels whenever new channels are created
    socket.on('channels_lists', loaded_channels => {
        var selectbox = document.querySelector('#chn_name');
        var i;
        for(i = selectbox.options.length - 1; i >= 0; i--)
        {
            selectbox.remove(i);
        }
        for(var x = 0; x < loaded_channels.length; x++){
            const option_load = document.createElement('option');
            option_load.innerHTML = `${loaded_channels[x]}`;
            document.querySelector('#chn_name').append(option_load);
        }
        if(localStorage.getItem('current_channel'))
            document.getElementById('chn_name').value = localStorage.getItem('current_channel');
    });

    // Sends message out to everyone. Also counts total number of messages sent by user
    socket.on('message_sent', data => {
        localStorage.setItem('total_messages', total_messages);
        total_messages = parseInt(localStorage.getItem('total_messages')) + 1;
        localStorage.setItem('total_messages', total_messages);
        var num = localStorage.getItem('total_messages');
        document.querySelector('#totalmsgs').innerHTML = `Total Messages Sent: ${num}`;
        var list = document.querySelector('#chn_name');
        var curr_channel = list.options[list.selectedIndex].value;
        if(curr_channel === data["curr_channel"])
        {
            const li = document.createElement('li');
            li.innerHTML = `${data["name"]} : ${data["set_msg"]} - ${data["date"]}`;
            document.querySelector('#msgs_sent').append(li);
        }
        else{
            alert("message in another chat");
        }
    });

    // Creates a new channel
    socket.on('created new channel', new_channel => {
        const option = document.createElement('option');
        option.innerHTML = `${new_channel}`;
        document.querySelector('#chn_name').append(option);
    });

});