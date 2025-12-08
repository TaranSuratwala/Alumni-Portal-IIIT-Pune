

const QueryMail = (title,message,name,email) => {
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
      </div><h2 style="color:#003366; margin-bottom: 16px;">Message From a Student - Alumni Portal, IIIT Pune</h2>
      <p>Hello,</p>
      <p>
        You have received a new message from a student through the Alumni Portal.
        Please find the details below:
      </p>
      <p><strong>Subject:</strong> ${title}</p>
      <p><strong>Message:</strong></p>
      <p style="background:#f4f4f4; padding:10px; border-left:4px solid #003366;">
        ${message}
      </p>

      <p style="margin-top:20px;">
        <em>This email was sent automatically via the Alumni Portal system.  
        The student’s contact information is included below for your reference.</em>
      </p>

      <p><strong>Student Name:</strong> ${name}</p>
      <p><strong>Student Email:</strong> ${email}</p>

      <br/>
      <p>Regards,</p>
      <p style="margin-top: -5px;">Alumni Portal, IIIT Pune</p>
    </div>
</body>
</html>`
  )
}

module.exports = QueryMail;