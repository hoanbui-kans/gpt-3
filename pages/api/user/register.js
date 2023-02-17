// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connection from "../../../services/database";
import { ErrorAsync } from "../../../services/ErrorAsync";
import bcrypt from 'bcrypt';
import nc from "next-connect";

const saltRounds = 10;

export const config = {
    api: {
      bodyParser: true,
    },
}

let responseMessage = { 
    error: true,
    message: 'Đã có lỗi xảy ra, xin vui lòng thử lại sau'
};

// create application/json parser
const handler = nc(ErrorAsync);

handler.post( async (req, res) => {
        if(!req.body){
            return res.status(403).json(responseMessage)
        } else {
            const { username, email, password } = req.body;
            if( username === undefined || email === undefined || !password === undefined){
                responseMessage.message = 'Các trường thông tin không chính xác hoặc bị thiếu';
                return res.status(403).json(responseMessage);
            } else {
                /* Check existed User Account */
                try {
                    let validate = {
                        username: false,
                        email: true,
                    };

                    let avaiableUser = [];

                    avaiableUser = await connection.promise().query({
                                sql: 'SELECT * FROM `kanbox_users` WHERE `username` = ? OR `email` = ?;',
                                rowsAsArray: false
                            },
                            [username, email], 
                            function(err, rows, fields) {
                               return rows
                            }
                    );

                    if(avaiableUser[0].length > 0){
                        responseMessage.message = 'Tên tài khoản hoặc địa chỉ email đã có người sử dụng';
                        return res.status(403).json(responseMessage);
                    } else {
                        /* Save All Data */
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            bcrypt.hash( password, salt, function(err, hash) {
                                if(hash){
                                    try {
                                        let result = connection.promise().query('INSERT INTO `kanbox_users` (`username`, `email`, `password`) VALUES ( ?, ?, ? );',
                                            [ username, email, hash ], 
                                            function(err, response) {
                                                    if(err) { 
                                                        return res.status(403).json(responseMessage); 
                                                    }
                                                return (response);
                                        });

                                        responseMessage = {
                                            error: false,
                                            message: 'Đã đăng ký tài khoản thành công',
                                        }
                                        return res.status(200).json(responseMessage);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    res.status(403).json(responseMessage)
                                }
                            });
                        });
                        /* Save data end */
                    }

                } catch (error) {
                    console.log(error);
                }
                /* End check existed User Account */
            }
        }
       
    }
)

export default handler 