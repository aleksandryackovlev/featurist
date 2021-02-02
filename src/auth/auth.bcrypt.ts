import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Bcrypt {
  compare(data: any, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
