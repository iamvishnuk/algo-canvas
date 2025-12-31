import { EnvConfig } from './EnvConfig';

export const EmailConfig = {
  host: EnvConfig.SMTP_HOST,
  port: EnvConfig.SMTP_PORT,
  secure: EnvConfig.SMTP_SECURE,
  auth: {
    user: EnvConfig.SMTP_USER,
    pass: EnvConfig.SMTP_PASS
  },
  from: {
    name: 'Algo Canvas',
    email: EnvConfig.SMTP_FROM
  }
};
