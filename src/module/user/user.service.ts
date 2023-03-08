import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.schema';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserBaseDto } from './dto/userBase.dto';
import { Model } from 'mongoose';
import * as Bcrypt from 'bcrypt-nodejs';
import * as JWT from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<User>,
  ) {}

  public async register(creationData: UserCreationDto): Promise<User> {
    if (!!(await this._getUserByEmail(creationData.email)))
      throw new BadRequestException('User Already Exists!');

    const passwordHash = Bcrypt.hashSync(creationData.password);
    const newUser: UserBaseDto = {
      fullName: creationData.fullName,
      email: creationData.email,
      passwordHash: passwordHash,
    };

    return await new this._userModel(newUser).save();
  }

  public async login(loginData: UserLoginDto): Promise<any> {
    const user = await this._getUserByEmail(loginData.email);

    if (!user) throw new NotFoundException('User Does Not Exist!');
    if (!Bcrypt.compareSync(loginData.password, user.passwordHash))
      throw new UnauthorizedException('Invalid Credentials!');

    const token = JWT.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
    );

    return { jwtToken: token };
  }

  private async _getUserByEmail(userEmail: string): Promise<User> {
    return await this._userModel.findOne({ email: userEmail });
  }
}
