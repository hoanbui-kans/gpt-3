class ConservationService {
  static async run(WitService, text, context){
    if(!text){
      context.conservation.followUp = 'Hey back!';
      return context;
    }
    const entities = await (new WitService()).query(text);
    context.conservation.entities = { ...context.conservation.entities, ...entities };
    if(entities) {
      return ConservationService.intentProductQuery(context);
    }
    context.conservation.followUp = 'Tôi không hiểu ý của bạn, xin vui lòng thử lại?';
    return context;
  }

  static intentProductQuery(context){
    const { conservation } = context;
    const { entities } = conservation;

    if(!entities['product:product']){
      context.conservation.followUp = 'Xin chào, chúng tôi có bán điện thoại di động, bạn muốn mua điện thoại nào?';
      return context;
    } 

    if(!entities['wit$contact:contact']){
      context.conservation.followUp = 'Cho mình xin tên của bạn được không?';
      return context;
    } 

    if(!entities['wit$location:location']){
      context.conservation.followUp = 'Bạn đang ở đâu?';
      return context;
    } 

    if(!entities['payment:paymentMethod']){
      context.conservation.followUp = 'Bạn muốn thanh toán bằng cách nào?';
      return context;
    } 

    context.conservation.followUp = `Cám ơn ${entities['wit$contact:contact']}, đơn hàng của bạn đã được đặt thành công!`;
    context.conservation.complete = true;

    return context
  }
}

export default ConservationService