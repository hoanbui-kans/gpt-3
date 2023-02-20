import connection from '../../services/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

class HandlerSocialLogin {
    constructor(requestData) {
        this.profile_id = requestData.profile_id; 
        this.user_email = requestData.user_email; 
        this.fullname = requestData.fullname; 
        this.first_name = requestData.first_name; 
        this.last_name = requestData.last_name; 
        this.picture = requestData.picture; 
        this.provider = requestData.provider;  
        this.access_token = requestData.access_token;
        this.password = this.generatorhashPasword();
    }

    async getUser (){
        try {
            const responseToken = await connection.promise().query('SELECT * FROM `kanbox_users` WHERE `id` = (SELECT `user_id` FROM `kanbox_users_social_meta` WHERE `profile_id` = ?) OR `username` = ?;', 
                [ this.profile_id, this.profile_id ], 
                function(err, result) {
                    return (result);
            });
            return responseToken[0][0];
        } catch (error) {
            return null
        }
    }

    async getUserById($userId){
        try {
            const response = await connection.promise().query('SELECT * FROM `kanbox_users` WHERE `id` = ?;', 
                [ $userId ], 
                function(err, result) {
                    return (result);
            });
            return response[0][0];
        } catch (error) {
            return null
        }
    }

    async createUser (){
        try {
            const newUserQuery = 'INSERT INTO `kanbox_users` ( `username`, `display_name`, `email`, `password`) VALUES ( ?, ?, ?, ? );'
            const response = await connection.promise().query( newUserQuery, [ this.profile_id, this.fullname, this.user_email, this.password ]);
            console.log('response', response);
            if(!response[0]) return false;
            const row = response[0];
            const rowId = row.insertId
            return this.getUserById(rowId);
        } catch (error) {
            return null;
        }
    }

    async updateUserData(NewUserId) {
       try {
            const getExistedPageQuery = 'SELECT * FROM `kanbox_users_social_meta` WHERE `profile_id` = ?';
            const existedSocialPage = await connection.promise().query( getExistedPageQuery,
            [this.profile_id], function (err, result) {
                return result;
            });

            if( Array.isArray(existedSocialPage[0]) && !existedSocialPage[0].length){
                const addNewUserQuery = 'INSERT INTO kanbox_users_social_meta ( `user_id`, `social_provider`, `profile_id`, `profile_email`, `profile_name`, `profile_given_name`, `profile_family_name`, `profile_picture`, `access_token`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )';
                const newUserProfile = await connection.promise().query( addNewUserQuery,
                    [NewUserId, this.provider, this.profile_id, this.user_email, this.fullname, this.first_name, this.last_name, this.picture, this.access_token ],
                    function (err, result) {
                        return result;
                });
                return newUserProfile;
            } else {
                const updateUserQuery = 'UPDATE `kanbox_users_social_meta` set  `user_id`=?, `social_provider`=?, `profile_email`=?, `profile_name`=?, `profile_given_name`=?, `profile_family_name`=?, `profile_picture`=?, `access_token`=? WHERE `kanbox_users_social_meta`.`profile_id`=?';
                const updateUserProfile = await connection.promise().query( updateUserQuery,
                    [NewUserId, this.provider, this.user_email, this.fullname, this.first_name, this.last_name, this.picture, this.access_token, this.profile_id ],
                    function (err, result) {
                        return result;
                });
                return updateUserProfile;
            }
       } catch (error) {
           return null
       }
    }

    generatorhashPasword () {
        const uuid = uuidv4();
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(uuid, salt);
        return hash;
    }

    async socialLogin() {
        const existedUser = await this.getUser();
        if(existedUser){
            const userId = existedUser.id;
            const UpdateNewFBData = await this.updateUserData(userId);
            if(UpdateNewFBData){
              return existedUser
            } else {
                return null;
            }
        } else {
            const createNewUser = await this.createUser();
            const userId = createNewUser.id;
            const UpdateNewFBData = await this.updateUserData(userId);
            if (createNewUser && UpdateNewFBData) {
              return createNewUser
            } else {
              return null;
            }
        }
    }
}

export default HandlerSocialLogin;