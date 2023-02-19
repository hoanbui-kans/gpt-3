import connection from '../../../services/database';
import { v4 as uuidv4 } from 'uuid';
import nc from 'next-connect';
import ErrorAsync from '../../../services/ErrorAsync';
import JwtMiddleWare from '../jwt';

const Handler = nc(ErrorAsync);

Handler.use(JwtMiddleWare);

Handler.get( async (req, res) => {
  if(!req.session) res.status(201).json(null);
  const { id } = req.session;
  try {
    const query = 'SELECT * FROM `kanbox_conservation` WHERE `user_id` =  ? ORDER BY `created_at` DESC;';
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

  const { id } = req.session;
  const { title } = req.body;

  if(!title || title == ''){
    return res.status(400).json(null)
  }

  try {
    const uuid = uuidv4();
    const query = 'INSERT INTO `kanbox_conservation` (`uuid`, `title`, `user_id`) VALUES (?, ?, ? );';
    const results = await connection.promise().query(query, [uuid, title, id]);
    
    if(results){
      res.status(200).json({
        uuid: uuid,
      });
    } else {
      res.status(400).json({
        message: 'Lỗi không mong muốn'
      })
    }

  } catch (error) {
    res.status(400).json({
      message: 'Lỗi không mong muốn'
    })
  }

});

Handler.put (async (req, res) => {
  if(!req.session) res.status(201).json(null);
  const { id } = req.session;

  try {
    const query = 'UPDATE `kanbox_conservation` SET ;';
    const results = await connection.promise().query(query, [id]);
    res.status(200).json(results[0]);
  } catch (error) {
    res.status(201).json(null)
  }
});


Handler.delete (async (req, res) => {
  if(!req.session) res.status(201).json(null);
  const { id } = req.session;
  try {
    const query = 'UPDATE `kanbox_conservation` SET ;';
    const results = await connection.promise().query(query, [id]);
    res.status(200).json(results[0]);
  } catch (error) {
    res.status(201).json(null)
  }
});

export default Handler