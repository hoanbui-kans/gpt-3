
import axios from 'axios';
import { SingletonWitClient } from './witService';

export class WitClientAPI extends SingletonWitClient {
    constructor (message) {
      this.message = message;
      this.response = {
        error: true,
        message: 'Đã có lỗi xảy ra, xin vui lòng thử lại sau',
        result: false
      }
    }
    
    async get_message(){
      try {
        const response = await this.instance.message(this.message);
        return response;
      } catch (error) {
        console.log(error)
      }
    }

    reply_product (WitMessage) {
      return false;
    }

}