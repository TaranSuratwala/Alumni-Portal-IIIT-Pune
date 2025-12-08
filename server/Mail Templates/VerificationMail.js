

const VerificationMail = (OTP) => {
  return (
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
      <div style="display: flex; gap: 5px; background: #003366; padding: 10px; font-weight: bold; align-items: center; justify-content: center; font-size: 14px; text-align: center; color: rgb(255,255,255)">
        <img src="https://res.cloudinary.com/dlihgtm62/image/upload/v1764339730/Alumni-logo_azyufb.png" width="50px"/>
        <p>Alumni Portal, IIIT Pune</p>
      </div>
      <h1>Email Verification - Alumni Portal, IIIT Pune</h1>
      <p>Dear User,</p>
      <p>Thank you for registering on the Alumni Portal.</p>
      <p>Your One-Time Password (OTP) for email verification is:<br/> OTP: <b>${OTP}<b/></p>
      <p>Please enter this code to complete your registration.</p>
      <p>The OTP will expire in 5 minutes.</p>
      <p>If you did not initiate this request, please ignore this email.For your security, do not share this OTP with anyone.</p>
      <br/>
      <p>Regards,</p>
      <p style="margin-top: -5px;">Alumni Portal, IIIT Pune</p>
    </div>
</body>
</html>`
  )
}

module.exports = VerificationMail;