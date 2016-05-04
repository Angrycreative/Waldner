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

  printStats() {
    let str = 'Statistik för ' + this.get('name');
    str += '\n```';

    str += 'Ranking, veckan:  ' + this.get('rank').weekly + '\n';
    str += 'Ranking, maraton: ' + this.get('rank').all_time + '\n';
    str += 'Rating, veckan:   ' + this.get('ratings').weekly + '\n';
    str += 'Rating, totalt:   ' + this.get('ratings').all_time + '\n';
    str += 'Spelade matcher:  ' + this.get('stats').games_played + '\n';
    str += 'Vinster:          ' + this.get('stats').wins + '\n';
    str += 'Förluster:        ' + this.get('stats').loses + '\n';
    str += 'Vunna set:        ' + this.get('stats').set_wins + '\n';
    str += 'Förlorade set:    ' + this.get('stats').set_loses + '\n';
    str += 'Vunna poäng:      ' + this.get('stats').total_points + '\n';
    str += 'Förlorade poäng:  ' + this.get('stats').total_points_against + '\n';

    str += '```';
    return str;
  }

}
