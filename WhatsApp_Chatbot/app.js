const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_SID;;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const contentSid = process.env.TWILIO_CONTENT_SID;
const senders = process.env.TWILIO_SENDER;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        from: senders,
        contentSid,
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+91 '
    })
    .then(message => console.log(message.sid))
    // .done();

client.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: senders,
        to: 'whatsapp:+91 '
    })
    .then(message => console.log(message.sid))