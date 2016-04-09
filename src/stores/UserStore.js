import Store from './Store.js';
import User from '../models/User.js';

export default class UserStore extends Store {

  constructor( data ) {
    super( data, User );
  }

}
