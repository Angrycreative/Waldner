import Store from './Store.js';
import Channel from '../models/Channel.js';

export default class ChannelStore extends Store {

  constructor( data ) {
    super( data, Channel );
  }

}
