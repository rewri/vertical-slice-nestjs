import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../../features/users/shared/entities/users.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.getOrThrow('MARIADB_HOST'),
        port: +configService.getOrThrow('MARIADB_PORT'),
        username: configService.getOrThrow('MARIADB_USER'),
        password: configService.getOrThrow('MARIADB_PASSWORD'),
        database: configService.getOrThrow('MARIADB_DATABASE'),
        entities: [User],
        timezone: 'America/Sao_Paulo',
        synchronize: false,
        logging: false,
        extra: {
          trustServerCertificate: true,
          ...(configService.get('MARIADB_SSL') === 'true' && {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
        },
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
