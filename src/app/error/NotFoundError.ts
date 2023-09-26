export default class NotFoundError extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
    this.statusCode = 404;
  }
}
