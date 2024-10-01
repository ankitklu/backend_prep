// const sgMail = require('@sendgrid/mail');
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
  //   to: '2200032823cseh@gmail.com', // Change to your recipient
  //   from: 'ankitkm1015@gmail.com', // Change to your verified sender
  //   subject: 'Sending with SendGrid is Fun',
  //   text: 'and easy to do anywhere, even with Node.js',
  //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // }
  
  // sgMail
  //   .send(msg)
  //   .then((response) => {
    //     console.log(response[0].statusCode)
    //     console.log(response[0].headers)
    //   })
    //   .catch((error) => {
      //     console.error(error)
      //   })


const dotenv= require('dotenv');
dotenv.config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
  body: 'Hello from Twilio!',
  from: '+916371219061',
  to: '+918917333647'
})
  .then(message => console.log(message.sid))
  .catch(error => console.error(error));

