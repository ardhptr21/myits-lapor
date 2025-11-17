import { UserType } from '../models/user';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: UserType & {
        id: string;
      };
      validated: {
        body: any;
        query: any;
        params: any;
      };
      uploadFolder: string | null;
    }
  }
}
