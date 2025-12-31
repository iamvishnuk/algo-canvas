import nodemailer, { Transporter } from 'nodemailer';
import { EmailConfig } from '../config/EmailConfig';
import { logger } from '../utils/Logger';
import { EmailTemplates } from '../templates/EmailTemplate';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
  }>;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    const smtpConfig = {
      host: EmailConfig.host,
      port: parseInt(EmailConfig.port || '587'),
      secure: EmailConfig.secure === 'true',
      ...(process.env.NODE_ENV === 'test'
        ? {}
        : {
            service: 'Gmail',
            auth: {
              user: EmailConfig.auth.user,
              pass: EmailConfig.auth.pass
            }
          })
    };

    this.transporter = nodemailer.createTransport(
      smtpConfig as nodemailer.TransportOptions
    );
  }

  async sendMail(options: EmailOptions): Promise<boolean> {
    try {
      const recipients = Array.isArray(options.to)
        ? options.to.join(',')
        : options.to;

      const res = await this.transporter.sendMail({
        from: `${EmailConfig.from.name} <${EmailConfig.from.email}>`,
        to: recipients,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      });

      logger.info('Email send successfully', {
        messageId: res.messageId,
        to: recipients,
        subject: options.subject
      });

      return true;
    } catch (error) {
      logger.error('Failed to send mail', {
        error,
        to: options.to,
        subject: options.subject
      });
      return false;
    }
  }

  async sendVerifyEmail(
    to: string,
    name: string,
    url: string
  ): Promise<boolean> {
    const template = EmailTemplates.emailVerification(name, url);

    return this.sendMail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }
}

export const emailService = new EmailService();
