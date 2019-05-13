import encrypt from '../encrypt';
import User from '../entities/User';
 
export default [new User('admin', encrypt('qwerty'))];