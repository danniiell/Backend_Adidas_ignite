// utilidades/sendcorreos.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '49e876fccf33ea',
    pass: 'c088027284838c'
  }
});


async function sendCorreo(destinatario, asunto, mensaje) {
  try {
    await transporter.sendMail({
      from: '"Soporte Técnico" <danielcbolivar@gmail.com>',
      to: destinatario,
      subject: asunto,
      text: mensaje
    });
    return { success: true };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return { success: false, error };
  }
}

module.exports = sendCorreo;


