import { Response } from 'express';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  public sendError(
    res: Response,
    statusCode: HttpStatus,
    message: string,
  ): void {
    res.status(statusCode).json({ success: false, message, data: null });
  }

  public sendSuccess(
    res: Response,
    statusCode: HttpStatus,
    data: Record<string, any>,
  ): void {
    res.status(statusCode).json({ success: true, ...data });
  }

  public sendNoContent(res: Response) {
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
