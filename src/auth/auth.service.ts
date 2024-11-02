import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return "Success";
    } else {
      throw new UnauthorizedException("Please check your login credentials");
    }
  }
}
