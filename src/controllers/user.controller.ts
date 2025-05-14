import { Request, Response, NextFunction } from 'express';
import { CreateUserSchema, UpdateUserSchema } from '../models/user.model';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/custom-error';

export const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      logger.info('Creating user:', validatedData.email);
      const user = await userService.createUser(validatedData);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      logger.info(`Fetching user: ${id}`);
      const user = await userService.getUserById(id);
      if (!user) {
        throw new CustomError('User not found', StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validatedData = UpdateUserSchema.parse(req.body);
      logger.info(`Updating user: ${id}`);
      const user = await userService.updateUser(id, validatedData);
      if (!user) {
        throw new CustomError('User not found', StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      logger.info(`Deleting user: ${id}`);
      const user = await userService.deleteUser(id);
      if (!user) {
        throw new CustomError('User not found', StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
};