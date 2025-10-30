import { DataSourceOptions } from "typeorm";
import { DB_HOST, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USERNAME } from "./global-vars";


const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(POSTGRES_PORT, 10),
    username: POSTGRES_USERNAME,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    migrationsRun: false,
};

export default databaseConfig;