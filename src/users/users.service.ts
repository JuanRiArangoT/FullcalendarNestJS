import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';
import { HttpErrorFilter } from '../commons/http-error.filter';
import { RolesService } from 'src/roles/roles.service';
import { UserRoles } from 'src/user_roles/entities/user_role.entity';

@Injectable()
@UseFilters(new HttpErrorFilter())
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly rolesService: RolesService,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { document: createUserDto.document },
      });
      if (existingUser) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Ya existe un usuario con ese documento.',
        };
      }
      const password = crypto
        .createHmac('SHA256', createUserDto.password)
        .digest('hex');
      delete createUserDto.password;
      const user = new Users();
      user.name = createUserDto.name;
      user.lastName = createUserDto.lastName;
      user.document = createUserDto.document;
      user.password = password;
      user.role = await this.rolesService.getRoleById(2); // rolId predefinido en 2
      const savedUser = await this.usersRepository.save(user);

      const userRole = new UserRoles();
      userRole.user = savedUser;
      userRole.role = user.role;
      await this.userRolesRepository.save(userRole);

      return savedUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No se encontró un usuario con ese ID.',
        };
      }
      const existingUser = await this.usersRepository.findOne({
        where: { document: updateUserDto.document },
      });
      if (existingUser && existingUser.id !== id) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Ya existe un usuario con ese documento.',
        };
      }
      user.name = updateUserDto.name;
      user.lastName = updateUserDto.lastName;
      user.document = updateUserDto.document;
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByDocument(document: number) {
    const user = await this.usersRepository.findOne({
      where: { document },
    });
    if (!user) {
      throw new NotFoundException(
        `No se encontró un usuario con el documento ${document}`,
      );
    }
    return user;
  }

  async findAll(): Promise<Users[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: number): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Usuario no encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(
          `No se encontró un usuario con el ID ${id}`,
        );
      }
      await this.usersRepository.delete(id);
      return {
        status: HttpStatus.OK,
        message: 'Usuario eliminado con éxito.',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      // Buscar el usuario en la base de datos
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Comparar la contraseña actual del usuario con la contraseña proporcionada
      if (
        user.password !==
        crypto.createHmac('SHA256', currentPassword).digest('hex')
      ) {
        throw new HttpException(
          'La contraseña actual no es correcta',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cifrar la nueva contraseña
      const password = crypto.createHmac('SHA256', newPassword).digest('hex');

      // Actualizar el registro del usuario en la base de datos
      user.password = password;
      await this.usersRepository.save(user);

      // Devolver mensaje de éxito
      return {
        status: HttpStatus.OK,
        message: 'La contraseña ha sido cambiada con éxito.',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(document: number, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { document },
    });
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No se encontró un usuario con ese documento.',
      };
    }
    const passwordHash = crypto.createHmac('SHA256', password).digest('hex');
    if (user.password !== passwordHash) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'La contraseña es incorrecta.',
      };
    }
    return user;
  }
}
