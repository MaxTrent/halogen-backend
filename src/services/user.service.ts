
// import { StatusCodes } from 'http-status-codes';
// import { z } from 'zod';
// import { CreateUserSchema, IUser, UpdateUserSchema, User } from '../models/user.model';
// import { logger } from '../utils/logger';

// export const userService = {
//   async createUser(data: z.infer<typeof CreateUserSchema>): Promise<IUser> {
//     logger.info('Creating user in database:', data.email);
//     const user = new User(data);
//     await user.save();
//     return user;
//   },

//   async getUserById(id: string): Promise<IUser | null> {
//     logger.info(`Fetching user from database: ${id}`);
//     return User.findById(id);
//   },

//   async updateUser(id: string, data: z.infer<typeof UpdateUserSchema>): Promise<IUser | null> {
//     logger.info(`Updating user in database: ${id}`);
//     return User.findByIdAndUpdate(id, data, { new: true });
//   },

//   async deleteUser(id: string): Promise<IUser | null> {
//     logger.info(`Deleting user from database: ${id}`);
//     return User.findByIdAndDelete(id);
//   },
// };