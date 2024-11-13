import User from './models/user.model.js';
import bcrypt from 'bcrypt';

class UserManager {
    async add(data) {
        data.password = bcrypt.hashSync(data.password, 10);
        return await User.create(data);
    }

    async getOne(filter) {
        return await User.findOne(filter).lean();
    }

    async isValidPassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

export default UserManager;
