import Model from './Model.js';

export default class User extends Model {

  constructor( props ) {
    super( props );
  }

  getPropsForGame() {
    return {
      name: this.get('real_name'),
      slack_id: this.get('id'),
      slack_name: this.get('name'),
      avatar_url: this.get('profile').image_original
    } 
  }

}
