import { Controller, Body, Post } from '@nestjs/common';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('register')
  public async register(@Body() creationData: UserCreationDto) {
    return await this._userService.register(creationData);
  }

  @Post('login')
  public async login(@Body() loginData: UserLoginDto) {
    return await this._userService.login(loginData);
  }
}
