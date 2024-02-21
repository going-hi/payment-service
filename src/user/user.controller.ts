import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    hello() {
        return 'hello world';
    }

    @Get('hello')
    he() {
        return 'hello world';
    }
}
