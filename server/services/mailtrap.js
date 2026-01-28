const { MailtrapClient } = require('mailtrap');

const template = require('../config/template');
const keys = require('../config/keys');

const { token, sender } = keys.mailtrap;

class MailtrapService {
  init() {
    try {
      return new MailtrapClient({
        token: token
      });
    } catch (error) {
      console.warn('Missing mailtrap token');
    }
  }
}

const mailtrap = new MailtrapService().init();

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);
    const recipient = [{ email }];

    const config = {
      from: sender,
      to: recipient,
      subject: message.subject,
      text: message.text
    };

    return await mailtrap.send(config);
    console.log(sender)
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
      message = '';
  }

  return message;
};
