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
        if (mailOptions.html && mailOptions.html.includes('paymentQR')) {
          console.log('\n✅ HTML EMAIL CONTAINS QR CODE');
          console.log('QR Code detected in HTML content');
        } else if (mailOptions.html && mailOptions.html.includes('Payment Instructions')) {
          console.log('\n✅ HTML EMAIL CONTAINS PAYMENT SECTION');
        } else {
          console.log('\n⚠️ HTML EMAIL DOES NOT CONTAIN QR CODE');
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking, user, tool, owner) => {
  const transporter = createTransporter();

  console.log('📧 Preparing booking confirmation email...');
  console.log('   Owner data:', { name: owner?.name, upiId: owner?.upiId, hasQR: !!owner?.paymentQR });

  const paymentQRSection = owner?.paymentQR ? `
      <div class="details" style="border-left-color: #667eea;">
        <h3>💳 Payment Instructions</h3>
        <p><strong>Security Deposit Amount: ₹${booking.deposit}</strong></p>
        <p>Please scan the QR code below to pay the security deposit:</p>
        <div style="text-align: center; margin: 15px 0;">
          <img src="cid:paymentQR" alt="Payment QR Code" style="max-width: 200px; border: 2px solid #667eea; padding: 10px; background: white;">
        </div>
        <p style="font-size: 12px; color: #666;">Or use UPI ID: <strong>${owner.upiId || 'N/A'}</strong></p>
        <p style="background: #fff3cd; padding: 10px; border-radius: 5px; font-size: 12px;">
          ⚠️ After payment, please mark it as paid in your AgriRent dashboard to confirm.
        </p>
      </div>
  ` : '';

  if (paymentQRSection) {
    console.log('   ✅ Payment QR section included in email');
  } else {
    console.log('   ⚠️ Payment QR section NOT included (owner.paymentQR is missing)');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: user.email,
    subject: '✅ Booking Confirmed - Payment Required - AgriRent',
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
Security Deposit: ₹${booking.deposit}
Rental Amount: ₹${booking.totalAmount}
Total Amount: ₹${booking.totalAmount + booking.deposit}

PAYMENT REQUIRED:
Please pay the security deposit of ₹${booking.deposit} to the owner.
Owner UPI ID: ${owner?.upiId || 'N/A'}

Owner Contact:
Name: ${tool.owner?.name || 'N/A'}
Phone: ${tool.owner?.phone || 'N/A'}

Important Notes:
• Pay the security deposit first
• Contact owner to arrange pickup
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
        <p><strong>Security Deposit:</strong> ₹${booking.deposit}</p>
        <p><strong>Rental Amount:</strong> ₹${booking.totalAmount}</p>
        <p class="amount">Total Amount: ₹${booking.totalAmount + booking.deposit}</p>
      </div>

      ${paymentQRSection}

      <div class="details">
        <h3>👤 Owner Contact</h3>
        <p><strong>Name:</strong> ${tool.owner?.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${tool.owner?.phone || 'N/A'}</p>
      </div>

      <div class="details">
        <h3>⚠️ Important Notes</h3>
        <ul>
          <li>Pay the security deposit first</li>
          <li>Contact the owner to arrange pickup</li>
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

  // Add QR code as attachment if available
  if (owner?.paymentQR) {
    // Extract base64 data from data URL
    const base64Data = owner.paymentQR.replace(/^data:image\/\w+;base64,/, '');
    mailOptions.attachments = [
      {
        filename: 'payment-qr.png',
        content: base64Data,
        encoding: 'base64',
        cid: 'paymentQR' // This CID is referenced in the HTML as src="cid:paymentQR"
      }
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
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

// Send new booking request notification to owner
const sendBookingRequestEmail = async (booking, farmer, tool, owner) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: owner.email,
    subject: '📋 New Booking Request - AgriRent',
    text: `
Dear ${owner.name},

You have received a new booking request for your equipment!

Booking Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipment: ${tool.name}
Category: ${tool.category}

Farmer Details:
Name: ${farmer.name}
Phone: ${farmer.phone}
Email: ${farmer.email}

Rental Period:
Start Date: ${new Date(booking.startDate).toLocaleDateString()}
End Date: ${new Date(booking.endDate).toLocaleDateString()}
Total Days: ${booking.totalDays}

Payment Details:
Rental Amount: ₹${booking.totalAmount}
Security Deposit: ₹${booking.deposit}
Total Amount: ₹${booking.totalAmount + booking.deposit}

Action Required:
Please log in to AgriRent to approve or reject this booking request.

Status: PENDING APPROVAL

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
    .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .amount { font-size: 18px; font-weight: bold; color: #667eea; }
    .action-btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 New Booking Request!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${owner.name}</strong>,</p>
      <p>You have received a new booking request for your equipment!</p>
      
      <div class="details">
        <h3>🚜 Equipment Details</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Category:</strong> ${tool.category}</p>
      </div>

      <div class="details">
        <h3>👤 Farmer Details</h3>
        <p><strong>Name:</strong> ${farmer.name}</p>
        <p><strong>Phone:</strong> ${farmer.phone}</p>
        <p><strong>Email:</strong> ${farmer.email}</p>
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
        <h3>⏳ Status</h3>
        <p><strong>Current Status:</strong> PENDING APPROVAL</p>
        <p>Please log in to AgriRent to approve or reject this booking request.</p>
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
    console.log('✅ Booking request email sent to owner:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send farmer cancellation confirmation email to farmer
const sendFarmerCancellationConfirmationEmail = async (booking, farmer) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: farmer.email,
    subject: '✅ Your Booking Cancellation Confirmed - AgriRent',
    text: `
Dear ${farmer.name},

Your booking cancellation has been confirmed.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipment: ${booking.tool.name}
Dates: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}

Status: CANCELLED BY YOU

The tool owner has been notified about your cancellation.

You can browse other available equipment on AgriRent.

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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Cancellation Confirmed</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${farmer.name}</strong>,</p>
      <p>Your booking cancellation has been <strong>CONFIRMED</strong>.</p>
      
      <div class="details">
        <h3>📋 Booking Details</h3>
        <p><strong>Equipment:</strong> ${booking.tool.name}</p>
        <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
      </div>

      <div class="details">
        <h3>✅ Status</h3>
        <p><strong>Cancellation Status:</strong> CANCELLED BY YOU</p>
        <p>The tool owner has been notified about your cancellation.</p>
      </div>

      <p>You can browse other available equipment on AgriRent.</p>
      <p>Thank you for using AgriRent!</p>
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
    console.log('✅ Farmer cancellation confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send farmer cancellation notification to owner
const sendFarmerCancellationEmail = async (booking, owner, farmer) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: owner.email,
    subject: '⚠️ Booking Cancelled by Farmer - AgriRent',
    text: `
Dear ${owner.name},

A farmer has cancelled their booking for your equipment.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Equipment: ${booking.tool.name}
Farmer: ${farmer.name}
Farmer Phone: ${farmer.phone}
Farmer Email: ${farmer.email}

Rental Period:
Start Date: ${new Date(booking.startDate).toLocaleDateString()}
End Date: ${new Date(booking.endDate).toLocaleDateString()}

Cancellation Status: CANCELLED BY FARMER

Your equipment is now available for these dates again.

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
    .header { background: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Booking Cancelled by Farmer</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${owner.name}</strong>,</p>
      <p>A farmer has cancelled their booking for your equipment.</p>
      
      <div class="details">
        <h3>📋 Booking Details</h3>
        <p><strong>Equipment:</strong> ${booking.tool.name}</p>
        <p><strong>Farmer Name:</strong> ${farmer.name}</p>
        <p><strong>Farmer Phone:</strong> ${farmer.phone}</p>
        <p><strong>Farmer Email:</strong> ${farmer.email}</p>
      </div>

      <div class="details">
        <h3>📅 Rental Period</h3>
        <p><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
      </div>

      <div class="details">
        <h3>✅ Status</h3>
        <p><strong>Cancellation Status:</strong> CANCELLED BY FARMER</p>
        <p>Your equipment is now available for these dates again.</p>
      </div>

      <p>Thank you for using AgriRent!</p>
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
    console.log('✅ Farmer cancellation email sent to owner:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send deposit payment confirmation to farmer
const sendDepositPaymentConfirmationEmail = async (booking, farmer, tool, owner) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: farmer.email,
    subject: '✅ Deposit Payment Confirmed - AgriRent',
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
      <h1>✅ Deposit Payment Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${farmer.name}</strong>,</p>
      <p>Your security deposit payment has been successfully received and confirmed!</p>
      
      <div class="details">
        <h3>💰 Payment Details</h3>
        <p><strong>Amount Paid:</strong> <span class="amount">₹${booking.deposit}</span></p>
        <p><strong>Payment Type:</strong> Security Deposit</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
      </div>

      <div class="details">
        <h3>📋 Booking Information</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Rental Period:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Days:</strong> ${booking.totalDays}</p>
      </div>

      <div class="details">
        <h3>👤 Owner Contact</h3>
        <p><strong>Name:</strong> ${owner.name}</p>
        <p><strong>Phone:</strong> ${owner.phone}</p>
      </div>

      <div class="details">
        <h3>📝 Next Steps</h3>
        <ul>
          <li>Contact the owner to arrange equipment pickup</li>
          <li>Rental amount (₹${booking.totalAmount}) will be due during the rental period</li>
          <li>Your deposit will be refunded after equipment return in good condition</li>
        </ul>
      </div>

      <p>Thank you for using AgriRent!</p>
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
    await transporter.sendMail(mailOptions);
    console.log('✅ Deposit payment confirmation email sent to farmer');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

// Send deposit payment notification to owner
const sendDepositPaymentNotificationToOwner = async (booking, farmer, tool, owner) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: owner.email,
    subject: '💰 Deposit Payment Received - AgriRent',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .amount { font-size: 18px; font-weight: bold; color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Deposit Payment Received!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${owner.name}</strong>,</p>
      <p>Great news! The farmer has paid the security deposit for your equipment.</p>
      
      <div class="details">
        <h3>💰 Payment Details</h3>
        <p><strong>Amount Received:</strong> <span class="amount">₹${booking.deposit}</span></p>
        <p><strong>Payment Type:</strong> Security Deposit</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
      </div>

      <div class="details">
        <h3>🚜 Equipment Details</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Rental Period:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Days:</strong> ${booking.totalDays}</p>
        <p><strong>Rental Amount:</strong> ₹${booking.totalAmount}</p>
      </div>

      <div class="details">
        <h3>👤 Farmer Details</h3>
        <p><strong>Name:</strong> ${farmer.name}</p>
        <p><strong>Phone:</strong> ${farmer.phone}</p>
        <p><strong>Email:</strong> ${farmer.email}</p>
      </div>

      <div class="details">
        <h3>📝 Next Steps</h3>
        <ul>
          <li>The farmer will contact you to arrange equipment pickup</li>
          <li>Ensure the equipment is ready for the rental period</li>
          <li>Rental payment will be collected during the rental period</li>
        </ul>
      </div>

      <p>Thank you for using AgriRent!</p>
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
    await transporter.sendMail(mailOptions);
    console.log('✅ Deposit payment notification email sent to owner');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

// Send rent payment confirmation to farmer
const sendRentPaymentConfirmationEmail = async (booking, farmer, tool, owner) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: farmer.email,
    subject: '✅ Rent Payment Confirmed - AgriRent',
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
      <h1>✅ Rent Payment Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${farmer.name}</strong>,</p>
      <p>Your rental payment has been successfully received and confirmed!</p>
      
      <div class="details">
        <h3>💰 Payment Details</h3>
        <p><strong>Amount Paid:</strong> <span class="amount">₹${booking.totalAmount}</span></p>
        <p><strong>Payment Type:</strong> Rental Payment</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
      </div>

      <div class="details">
        <h3>📋 Booking Information</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Rental Period:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Days:</strong> ${booking.totalDays}</p>
      </div>

      <div class="details">
        <h3>👤 Owner Contact</h3>
        <p><strong>Name:</strong> ${owner.name}</p>
        <p><strong>Phone:</strong> ${owner.phone}</p>
      </div>

      <div class="details">
        <h3>📝 Next Steps</h3>
        <ul>
          <li>All payments are now complete</li>
          <li>Your security deposit (₹${booking.deposit}) will be refunded after equipment return</li>
          <li>Please return the equipment in good condition by ${new Date(booking.endDate).toLocaleDateString()}</li>
          <li>Contact the owner to arrange equipment return</li>
        </ul>
      </div>

      <p>Thank you for using AgriRent!</p>
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
    await transporter.sendMail(mailOptions);
    console.log('✅ Rent payment confirmation email sent to farmer');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

// Send rent payment notification to owner
const sendRentPaymentNotificationToOwner = async (booking, farmer, tool, owner) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@agrirent.com',
    to: owner.email,
    subject: '💰 Rent Payment Received - AgriRent',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .amount { font-size: 18px; font-weight: bold; color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Rent Payment Received!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${owner.name}</strong>,</p>
      <p>Great news! The farmer has paid the rental amount for your equipment.</p>
      
      <div class="details">
        <h3>💰 Payment Details</h3>
        <p><strong>Amount Received:</strong> <span class="amount">₹${booking.totalAmount}</span></p>
        <p><strong>Payment Type:</strong> Rental Payment</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Total Received:</strong> ₹${booking.deposit + booking.totalAmount} (Deposit + Rent)</p>
      </div>

      <div class="details">
        <h3>🚜 Equipment Details</h3>
        <p><strong>Equipment:</strong> ${tool.name}</p>
        <p><strong>Rental Period:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Days:</strong> ${booking.totalDays}</p>
      </div>

      <div class="details">
        <h3>👤 Farmer Details</h3>
        <p><strong>Name:</strong> ${farmer.name}</p>
        <p><strong>Phone:</strong> ${farmer.phone}</p>
        <p><strong>Email:</strong> ${farmer.email}</p>
      </div>

      <div class="details">
        <h3>📝 Next Steps</h3>
        <ul>
          <li>All payments are now complete</li>
          <li>Ensure the equipment is available for the rental period</li>
          <li>After the rental period ends, inspect the equipment</li>
          <li>Refund the security deposit (₹${booking.deposit}) if equipment is in good condition</li>
        </ul>
      </div>

      <p>Thank you for using AgriRent!</p>
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
    await transporter.sendMail(mailOptions);
    console.log('✅ Rent payment notification email sent to owner');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
  sendFarmerCancellationEmail,
  sendFarmerCancellationConfirmationEmail,
  sendBookingRequestEmail,
  sendDepositPaymentConfirmationEmail,
  sendDepositPaymentNotificationToOwner,
  sendRentPaymentConfirmationEmail,
  sendRentPaymentNotificationToOwner
};
