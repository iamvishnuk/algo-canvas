export enum VerificationType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

export interface IVerificationCode {
  id: string;
  userId: string;
  code: string;
  type: VerificationType;
  createdAt: Date;
  expiresAt: Date;
}

export class VerificationCode implements IVerificationCode {
  private constructor(
    public id: string,
    public userId: string,
    public code: string,
    public type: VerificationType,
    public createdAt: Date,
    public expiresAt: Date
  ) {}

  static create(data: {
    id: string;
    userId: string;
    code: string;
    type: VerificationType;
    createdAt: Date;
    expiresAt: Date;
  }): VerificationCode {
    return new VerificationCode(
      data.id,
      data.userId,
      data.code,
      data.type,
      data.createdAt,
      data.expiresAt
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  matches(code: string): boolean {
    return this.code === code;
  }
}
