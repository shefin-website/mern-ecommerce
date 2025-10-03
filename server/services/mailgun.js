const formData = require('form-data');
const Mailgun = require('mailgun.js');

const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, sender } = keys.mailgun;

class MailgunService {
  init() {
    try {
      const mailgun = new Mailgun(formData);
      return mailgun.client({ username: 'api', key });
    } catch (error) {
      console.warn('Missing mailgun keys');
    }
  }
}

const mailgun = new MailgunService().init();

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      from: `MERN Store! <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text,
    };

    return await mailgun.messages.create(domain, config);
  } catch (error) {
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;
    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;
    case 'signup':
      message = template.signupEmail(data);
      break;
    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;
    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;
    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;
    case 'contact':
      message = template.contactEmail();
      break;
    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;
    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;
    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;
    default:
      message = { subject: '', text: '' };
  }

  return message;
};
