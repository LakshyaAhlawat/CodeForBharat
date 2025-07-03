const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Welcome email template
const welcomeEmailTemplate = (username) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to CodeToGame! 🎮</h1>
      <p>Hi ${username},</p>
      <p>Welcome to CodeToGame - the free visual game builder platform!</p>
      <p>You can now:</p>
      <ul>
        <li>Create games using our intuitive visual editor</li>
        <li>Choose from pre-built templates (Platformer, Runner, Flappy, Shooter)</li>
        <li>Upload custom assets</li>
        <li>Share your games with the community</li>
        <li>Play games created by other users</li>
      </ul>
      <p>Get started by visiting your dashboard and creating your first game!</p>
      <p>Happy game building!</p>
      <p>The CodeToGame Team</p>
    </div>
  `;
};

// Game published notification template
const gamePublishedTemplate = (username, gameTitle, shareId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10B981;">Game Published Successfully! 🚀</h1>
      <p>Hi ${username},</p>
      <p>Your game "<strong>${gameTitle}</strong>" has been published successfully!</p>
      <p>Share your game with friends using this link:</p>
      <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">
        <strong>${process.env.FRONTEND_URL}/play/${shareId}</strong>
      </p>
      <p>Your game is now live and can be played by anyone!</p>
      <p>Keep creating amazing games!</p>
      <p>The CodeToGame Team</p>
    </div>
  `;
};

// Review notification template
const reviewNotificationTemplate = (creatorName, gameTitle, reviewerName, rating, comment) => {
  const stars = '⭐'.repeat(rating);
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #F59E0B;">New Review Received! ⭐</h1>
      <p>Hi ${creatorName},</p>
      <p>Your game "<strong>${gameTitle}</strong>" has received a new review!</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>Reviewer:</strong> ${reviewerName}</p>
        <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
        ${comment ? `<p><strong>Comment:</strong> "${comment}"</p>` : ''}
      </div>
      <p>Keep up the great work creating awesome games!</p>
      <p>The CodeToGame Team</p>
    </div>
  `;
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to CodeToGame! 🎮',
      html: welcomeEmailTemplate(username)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send game published notification
const sendGamePublishedEmail = async (email, username, gameTitle, shareId) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your game "${gameTitle}" is now live! 🚀`,
      html: gamePublishedTemplate(username, gameTitle, shareId)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Game published email sent to ${email}`);
  } catch (error) {
    console.error('Error sending game published email:', error);
  }
};

// Send review notification
const sendReviewNotification = async (creatorEmail, creatorName, gameTitle, reviewerName, rating, comment) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: creatorEmail,
      subject: `New review for "${gameTitle}"! ⭐`,
      html: reviewNotificationTemplate(creatorName, gameTitle, reviewerName, rating, comment)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Review notification sent to ${creatorEmail}`);
  } catch (error) {
    console.error('Error sending review notification:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendGamePublishedEmail,
  sendReviewNotification
};