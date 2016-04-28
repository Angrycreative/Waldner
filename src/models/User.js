import Model from './Model.js';

export default class User extends Model {

  constructor( props ) {
    super( props );
    this.url = 'users';
  }

  // Necessary props with format that server needs
  getPropsForGame() {
    return {
      // id: this.get('id'),
      name: this.get('real_name'),
      email: this.get('profile').email,
      slack_id: this.get('id'),
      slack_name: this.get('name'),
      avatar_url: this.get('profile').image_original
    } 

  }

}
