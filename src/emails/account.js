const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "mikolaj35@wp.pl",
    subject: "Welcome to the task manager app!",
    text: `Welcome to the app, ${name}! Hope You will enjoy using it.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "mikolaj35@wp.pl",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}! I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
