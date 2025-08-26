import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @IsString()
  @IsOptional()
  @IsIn(['student', 'professor'])
  role?: string
}
