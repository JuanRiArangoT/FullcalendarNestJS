import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { RolesService } from 'src/roles/roles.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Validar que todos los campos requeridos estén presentes y sean válidos
    if (
      !createUserDto.name ||
      !createUserDto.lastName ||
      !createUserDto.document ||
      !createUserDto.password
    ) {
      throw new HttpException(
        'Faltan campos requeridos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    // Validar que el ID exista en la base de datos
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException(
        'No se encontró un usuario con ese ID.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Validar que no exista otro usuario con el mismo documento
    const existingUser = await this.usersService.findByDocument(
      updateUserDto.document,
    );
    if (existingUser && existingUser.id !== id) {
      throw new HttpException(
        'Ya existe un usuario con ese documento.',
        HttpStatus.CONFLICT,
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Get('document/:document')
  async findByDocument(@Param('document') document: number) {
    return await this.usersService.findByDocument(document);
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Users> {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException(
          `No se encontro un usuario con el Id ${user}`,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersService.delete(id);
      return {
        status: HttpStatus.OK,
        message: `Usuario eliminado con éxito. ${user}`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Post(':id/password')
  async changePassword(
    @Param('id') id: number,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      const result = await this.usersService.changePassword(
        id,
        currentPassword,
        newPassword,
      );
      return { status: HttpStatus.OK, message: result.message };
    } catch (error) {
      throw new HttpException(error.error, error.status);
    }
  }

  @Post('login')
  async login(@Body() body) {
    const { document, password } = body;
    const userOrError = await this.usersService.login(document, password);
    if (
      userOrError.hasOwnProperty('status') &&
      userOrError.hasOwnProperty('message')
    ) {
      return { status: userOrError.status, message: userOrError.message };
    }
    return { status: HttpStatus.OK, user: userOrError };
  }
}
