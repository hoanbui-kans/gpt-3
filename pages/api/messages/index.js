import connection from '../../../services/database';
import { v4 as uuidv4 } from 'uuid';
import nc from 'next-connect';
import ErrorAsync from '../../../services/ErrorAsync';
import JwtMiddleWare from '../jwt';
import { ChatGPTAPI } from 'chatgpt'

export const config = {
  api: {
    bodyParser: true,
  },
}

const Handler = nc(ErrorAsync);

Handler.use(JwtMiddleWare);

Handler.get( async (req, res) => {
  if(!req.session) res.status(201).json(null);
  const { id } = req.session;
  try {
    const query = 'SELECT * FROM `kanbox_conservation` WHERE `user_id` =  ?;';
    const results = await connection.promise().query(query, [id]);
    res.status(200).json(results[0]);
  } catch (error) {
    res.status(201).json(null)
  }
});

Handler.post( async (req, res) => {
  if(!req.session) res.status(403).json({
    message: "Lỗi đăng nhập"
  });
  try {
    const { conservation, uuid, message, direction, type } = req.body; 
    const InsertMessage = 'INSERT INTO `kanbox_messages` (`uuid`, `message`, `direction`, `type`) VALUES (?, ?, ?, ? );';
    const result = await connection.promise().query(InsertMessage, [uuid, message, direction, type]);
    if(result){
      const insertId = result[0].insertId;
      const queryConstraint = 'INSERT INTO `kanbox_conservation_messages` (`conservation`, `message`) VALUES (?, ?);';
      const insertConstraint = await connection.promise().query(queryConstraint, [conservation, insertId]);
      if(insertConstraint){
        return res.status(200).json(result);
      } else {
        return res.status(400).json({
          message: "Đã có lỗi xảy ra trong quá trình lữu trữ dữ liệu"
        });
      }
    }
  } catch (error) {
    res.status(400).json(null)
  }
});


export default Handler