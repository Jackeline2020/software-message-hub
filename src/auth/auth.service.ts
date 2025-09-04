import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly _jwtService: JwtService) { }

    async login() {
        const body = {
            sub: 'guest',
            username: 'guest-user'
        }

        return { access_token: this._jwtService.sign(body) }
    }
}
