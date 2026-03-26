const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For development, we'll use a test account or console logging
  // In production, use real SMTP credentials
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Real email configuration (Gmail example)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // For development - just log to console
    return {
      sendMail: async (mailOptions) => {
        console.log('\n📧 EMAIL NOTIFICATION (Development Mode)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Message:');
        console.log(mailOptions.text);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking, user, tool) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: user.email,
    subject: '✅ Booking Confirmed - AgriRent',
    text: `
Dear ${user.name},

Great news! Your booking has been CONFIRMED.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipment: ${tool.name}
Category: ${tool.category}
Location: ${tool.location}

Rental Period:
Start Date: ${new Date(booking.startDate).toLocaleDateString()}
End Date: ${new Date(booking.endDate).toLocaleDateString()}
Total Days: ${booking.totalDays}

Payment Details:
Rental Amount: ₹${booking.totalAmount}
Security Deposit: ₹${booking.deposit}
Total Amount: ₹${booking.totalAmount + booking.deposit}

Owner Contact:
Name: ${tool.owner?.name || 'N/A'}
Phone: ${tool.owner?.phone || 'N/A'}

Important Notes:
• Please contact the owner to arrange pickup
• Security deposit will be refunded after equipment return
• Ensure equipment is returned in good condition

Thank you for using AgriRent!

Best regards,
AgriRent Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .amount { font-size: 18px; font-weight: bold; color: #28a745; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Great news! Your booking has been <strong>CONFIRMED</strong>.</p>
      
      <div class="details">
        <h3>📋 Booking Details</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Category:</strong> ${tool.category}</p>
        <p><strong>Location:</strong> ${tool.location}</p>
      </div>

      <div class="details">
        <h3>📅 Rental Period</h3>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Days:</strong> ${booking.totalDays}</p>
      </div>

      <div class="details">
        <h3>💰 Payment Details</h3>
        <p><strong>Rental Amount:</strong> ₹${booking.totalAmount}</p>
        <p><strong>Security Deposit:</strong> ₹${booking.deposit}</p>
        <p class="amount">Total Amount: ₹${booking.totalAmount + booking.deposit}</p>
      </div>

      <div class="details">
        <h3>👤 Owner Contact</h3>
        <p><strong>Name:</strong> ${tool.owner?.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${tool.owner?.phone || 'N/A'}</p>
      </div>

      <div class="details">
        <h3>⚠️ Important Notes</h3>
        <ul>
          <li>Please contact the owner to arrange pickup</li>
          <li>Security deposit will be refunded after equipment return</li>
          <li>Ensure equipment is returned in good condition</li>
        </ul>
      </div>

      <p>Thank you for using AgriRent!</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>AgriRent Team</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send booking rejection email
const sendBookingRejectionEmail = async (booking, user, tool) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: user.email,
    subject: '❌ Booking Cancelled - AgriRent',
    text: `
Dear ${user.name},

We regret to inform you that your booking has been CANCELLED by the equipment owner.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipment: ${tool.name}
Dates: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}

You can browse other available equipment on AgriRent.

Thank you for your understanding.

Best regards,
AgriRent Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc3545; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Booking Cancelled</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>We regret to inform you that your booking has been <strong>CANCELLED</strong> by the equipment owner.</p>
      
      <div class="details">
        <h3>📋 Booking Details</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
      </div>

      <p>You can browse other available equipment on AgriRent.</p>
      <p>Thank you for your understanding.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>AgriRent Team</p>
    </div>
  </div>
</body>
</html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail
};
