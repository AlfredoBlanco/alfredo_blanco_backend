import { DataSource } from 'typeorm';
import databaseConfig from './databse.config';

const AppDataSource = new DataSource(databaseConfig);

export default AppDataSource;