import request from 'request';

export default class Model {

  constructor( props ) {
    this.props = props; 
  }

  get( key ) {
    return this.props[ key ];
  }

  save() {

    return new Promise( (resolve, reject) => {

      request.post({
        url: process.env.API_BASE + this.url,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        },
        formData: this.props
      })
      .on('response', (response) => {
        if ( response.statusCode >= 200 && response.statusCode < 300) {
          resolve( response );
        } else {
          reject( response );
        }
      })
      .on('error', (error) => {
        reject(error);
      });

    });

  }

}
