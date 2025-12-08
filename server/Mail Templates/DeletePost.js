

const DeletePost = (REASON) => {
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
      <h1>Job Posting Removal Notification - Alumni Portal, IIIT Pune</h1>
      <p>Dear User,</p>
      <p>Your job posting on the Alumni Portal, IIIT Pune has been removed by the admin.</p>
      <p>Reason for removal:</p>
      <p>${REASON}</p>
      <p>If you believe this was a mistake or need clarification, you may contact the Alumni Portal support team.</p>
      <br/>
      <p>Thank you,</p>
      <p style="margin-top: -5px;">Alumni Portal, IIIT Pune</p>
    </div>
</body>
</html>`
  )
}

module.exports = DeletePost;