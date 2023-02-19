import connection from '../../../services/database';
import { v4 as uuidv4 } from 'uuid';
import nc from 'next-connect';
import ErrorAsync from '../../../services/ErrorAsync';
import JwtMiddleWare from '../jwt';

const Handler = nc(ErrorAsync);

Handler.use(JwtMiddleWare);

Handler.get( async (req, res) => {

  const { uuid } = req.query

  if(!req.session) res.status(400).json(null);

  const { id } = req.session;

  try {
    const conservationQuery = 'SELECT * FROM `kanbox_conservation` WHERE `uuid` = ? AND `user_id` = ?;';
    const conservationResults = await connection.promise().query(conservationQuery, [uuid, id]);
    if(conservationResults[0][0]){
      const conservation = conservationResults[0][0];
      const messageQuery = 'SELECT * FROM `kanbox_messages` WHERE `id` IN (SELECT `message` FROM `kanbox_conservation_messages` WHERE `conservation` = ?);';
      const messageResults = await connection.promise().query(messageQuery, [uuid]);

      if(messageResults){
        conservation.messages = messageResults[0];
      }
      res.status(200).json(conservation);
    }

    res.status(200).json(conservationResults);
  } catch (error) {
    console.log(error);
    res.status(400).json(null)
  }
});

export default Handler