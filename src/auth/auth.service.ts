import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async registerUser() {
    return { json: 'Heeelo' };
  }
  async getHello() {
    return { json: 'Heeelo' };
  }
}
