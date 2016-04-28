import request from 'request';
import Http from '../Http.js';

export default class Model {

  constructor( props ) {
    this.props = props || {}; 
    if ( props && props.id ) {
      this.id = props.id;
    }
  }

  get( key ) {
    return this.props[ key ];
  }

  fetch( url ) {
    return new Promise( (resolve, reject) => {

      if (!this.id) {
        reject( 'ID undefined');
      }

      url = url || process.env.API_BASE + this.url + '/' + this.id;

      Http.get( url )
        .then( data => {
          this.props = JSON.parse(data).data;
          resolve( data );
        })
        .catch( err => {
          reject( err );
        });

    });
  }

  save() {

    return new Promise( (resolve, reject) => {

      console.log(process.env.API_BASE + this.url);
      console.log('props', this.props);

      Http.post( process.env.API_BASE + this.url, this.props )
        .then( data => {
          resolve( data );
        })
        .catch( err => {
          reject( err );
        });

    });

  }

}
