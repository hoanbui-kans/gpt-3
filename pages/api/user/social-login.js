import nc from 'next-connect';
import { ErrorAsync } from '../../../services/ErrorAsync';
import HandlerSocialLogin from '../auth/handlesocialLogin';

const Handler = nc(ErrorAsync);

Handler.post(async (req, res) => {
    const HandlerSocial = new HandlerSocialLogin( req.body );
    const responseUser = await HandlerSocial.socialLogin();
    if(responseUser){
        res.status(200).json(responseUser);
    } else {
        res.status(403).json({
            message: 'Lỗi kết nối'
        });
    }
});

export default Handler