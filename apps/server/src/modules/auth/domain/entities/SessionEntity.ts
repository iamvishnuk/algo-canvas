export interface ISession {
  id: string;
  userId: string;
  userAgent: string;
  createdAt: Date;
  expiredAt: Date;
}
export class Session implements ISession {
  private constructor(
    public id: string,
    public userId: string,
    public userAgent: string,
    public createdAt: Date,
    public expiredAt: Date
  ) {}

  static create(data: {
    id: string;
    userId: string;
    userAgent: string;
    createdAt: Date;
    expiredAt: Date;
  }): Session {
    return new Session(
      data.id,
      data.userId,
      data.userAgent,
      data.createdAt,
      data.expiredAt
    );
  }
}
