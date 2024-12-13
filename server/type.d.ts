interface JwtPayload {
  sub: string;
}

interface JwtDecoded extends JwtPayload {
  iat: number;
  exp: number;
  username: string;
}

interface EmailConfig {
  from?: string;
  subject?: string;
  to: string | string[];
  html?: string;
  dynamicData?: object;
  fromName?: string;
}

interface UploadPayload {
  file: Buffer | Express.Multer.File;
  folder: string;
  maxSize?: number;
  public_id?: string;
  mimeTypes?: string[];
}
