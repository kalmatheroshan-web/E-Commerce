
function otp_html(otp) {
    return `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, sans-serif;">


    <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.08);">
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table align="center" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">


    <!-- Main Container -->
    <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#ff8c42,#ffb36b); padding:25px; text-align:center;">
          <h2 style="color:#ffffff; margin:0; font-size:22px; letter-spacing:1px;">
             Fikri Shop
          </h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; text-align:center;">

          <h3 style="color:#333; margin-bottom:10px;">OTP Verification</h3>

          <p style="color:#666; font-size:14px; line-height:1.6; margin:0 0 20px;">
            Use the verification code below to continue.  
            This code is valid for <b>5 minutes</b>.
          </p>

          <!-- OTP Box -->
          <div style="
            display:inline-block;
            padding:18px 35px;
            font-size:30px;
            font-weight:bold;
            letter-spacing:8px;
            color:#ff8c42;
            background:#fff7f0;
            border:2px solid #ffd2b3;
            border-radius:10px;
            box-shadow:0 4px 12px rgba(255,140,66,0.2);
          ">
            ${otp}
          </div>

          <p style="color:#999; font-size:12px; margin-top:25px; line-height:1.5;">
            If you didn’t request this code, please ignore this email.
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#fafafa; padding:18px; text-align:center;">
          <p style="margin:0; font-size:12px; color:#aaa;">
            © 2026 Fikri Shop • Secure Authentication
          </p>
        </td>
      </tr>

    </table>



</body >
</html >

   
    `
}

module.exports = otp_html;