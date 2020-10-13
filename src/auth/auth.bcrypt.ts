import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  compare(
    data: any,
    encrypted: string,
    callback?: (err: Error, same: boolean) => void,
  ): Promise<boolean> {
    return bcrypt.compare(data, encrypted, callback);
  }
}
