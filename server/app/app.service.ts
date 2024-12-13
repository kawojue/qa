import { Request } from 'express';
import { Misc } from 'helpers/misc';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  base(req: Request, ip: string) {
    return { ip: Misc.formatIP(ip), ...Misc.getDeviceInfo(req) };
  }
}
