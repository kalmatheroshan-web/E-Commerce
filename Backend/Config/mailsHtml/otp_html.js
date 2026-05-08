function otp_html(otp) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, h1, h2, h3 { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0f2f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 450px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #ff8c42; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">FIKRI SHOP</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 10px; color: #1a1a1a; font-size: 22px; font-weight: 700; text-align: center;">Verify your account</h2>
              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5; text-align: center;">
                Please use the following one-time password (OTP) to complete your secure login.
              </p>

              <!-- OTP Container -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #fdf2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #ff8c42; letter-spacing: 12px; margin-left: 12px;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; text-align: center; line-height: 1.6;">
                This code expires in <b style="color: #1a1a1a;">5 minutes</b>.<br>
                For security, never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Help Section -->
          <tr>
            <td style="padding: 0 30px 30px;">
                <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 25px;"></div>
                <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                    If you didn't request this code, you can safely ignore this email. 
                    Need help? <a href="#" style="color: #ff8c42; text-decoration: none; font-weight: 600;">Contact Support</a>
                </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                &copy; 2026 Fikri Shop &bull; Built with Care
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}

module.exports = otp_html;