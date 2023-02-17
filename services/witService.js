import React from 'react'
import { Wit } from 'node-wit'

class WitService {
  constructor(accessToken) {
      this.client = new Wit({
        accessToken: process.env.WIT_AI_TOKEN,
        // logger: new log.Logger(log.DEBUG) // optional
      });
  }

  async query(text) {
    const queryResult = await this.client.message(text);
    const { entities } = queryResult;
    const extractedEntities = {};
    Object.keys(entities).forEach((key) => {
      if(entities[key][0].confidence > 0.7){
        extractedEntities[key] = entities[key][0].value;
      }
    });
    return extractedEntities;
  }

}

export default WitService