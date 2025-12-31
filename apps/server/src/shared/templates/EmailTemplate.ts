export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailTemplates {
  static emailVerification(name: string, url: string): EmailTemplate {
    return {
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
              .warning { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                <h2>Hi ${name}!</h2>
                <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
                <a href="${url}" class="button">Verify Email</a>
                <div class="warning">
                  <p><strong>Note:</strong> This link will expire in 24 hours.</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${url}">${url}</a>
                </p>
              </div>
              <div class="footer">
                <p>If you didn't create an account, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Hi ${name}!\n\nThanks for signing up! Please verify your email address by clicking the link below:\n\n${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`
    };
  }
}
