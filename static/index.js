// GOOGlE's CODE!!!

// Client ID and API key from the Developer Console
var CLIENT_ID = '551536436441-82hnqci8461ot92pm31dadp6rs7ka6cb.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDwM6tQmG6FzInBA7EWV4ED4wm1gBS_XZU';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn)
{
if (isSignedIn)
{
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
}
else
{
  authorizeButton.style.display = 'block';
  signoutButton.style.display = 'none';
}
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
}).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
            when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')');
    }
    } else {
    appendPre('No upcoming events found.');
  }
});
}
// END OF GOOGLE's CODE!



document.addEventListener('DOMContentLoaded', () =>
{
    document.querySelectorAll('#create_event').forEach(button => {
        button.onclick = () => {
            var event = {
                'summary': 'SHSMUN 2018',
                'location': '1150 Carter St, Chattanooga, TN 37402',
                'description': 'SHSMUN 2018 MUN Conference',
                'start': {
                    'dateTime': '2018-11-16T09:00:00-10:00',
                    'timeZone': 'America/New_York'
                },
                'end': {
                    'dateTime': '2018-11-18T09:00:00-10:00',
                    'timeZone': 'America/New_York'
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                    {'email': 'secgen@shsmun.org'}
                ],
                'reminders': {
                    'useDefault': true
                }
            };
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            request.execute(function(event) {
                appendPre('Event created: ' + event.htmlLink);
            });
        };
    });
    document.querySelectorAll('#create_event2').forEach(button2 => {
        button2.onclick = () => {
            var event2 = {
                'summary': 'VOLMUN 2019',
                'location': '1512 Middle Dr, Knoxville, TN 37916',
                'description': 'VOLMUN 2019 MUN Conference',
                'start': {
                    'dateTime': '2019-02-16T09:00:00-10:00',
                    'timeZone': 'America/New_York'
                },
                'end': {
                    'dateTime': '2019-02-18T09:00:00-10:00',
                    'timeZone': 'America/New_York'
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                    {'email': 'jsharma19@lausanneschool.com'}
                ],
                'reminders': {
                    'useDefault': true
                }
            };
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event2
            });
            request.execute(function(event2) {
                appendPre('Event created: ' + event2.htmlLink);
            });
        };
    });


});
