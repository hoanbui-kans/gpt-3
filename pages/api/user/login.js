// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connection from "../../../services/database";
import { ErrorAsync } from "../../../services/ErrorAsync";
import bcrypt from 'bcrypt';
import nc from "next-connect";

export const config = {
    api: {
      bodyParser: true,
    },
}

const handler = nc(ErrorAsync);

let responseMessage = { 
    error: true,
    message: 'Đã có lỗi xảy ra, xin vui lòng thử lại sau'
};

handler.post( async (req, res) => {

        if(req.body){
            const { username, password } = req.body;
            
            if( username === undefined ){
                responseMessage.message = 'Các trường thông tin không chính xác hoặc bị thiếu';
                return res.status(403).json(responseMessage);
            } 
            
            let avaiableUser = [];

            try {
                avaiableUser = await connection.promise().query('SELECT * FROM `kanbox_users` WHERE `username` = ? OR `email` = ? limit 1;', 
                    [ username, username], 
                    function(err, result) {
                        return result;
                    }
                );

                if(!avaiableUser[0][0]){
                    responseMessage.message = 'Sai tên tài khoản hoặc mật khẩu';
                    return res.status(403).json(responseMessage);
                } else {
                    bcrypt.compare(password, avaiableUser[0][0].password).then(function(result) {
                        if(result){
                            responseMessage = {
                                error: false,
                                message: 'đăng nhập thành công'
                            }
                            res.status(200).json(avaiableUser[0][0]);
                        } else {
                            responseMessage.message = 'Sai tên tài khoản hoặc mật khẩu';
                            res.status(403).json(responseMessage);
                        }
                    });
                }

            } catch (error) {
                res.status(403).json(responseMessage);
            }

        } else {
            res.status(403).json(responseMessage);
        }
    }
)

export default handler 