import request from 'request';

export default class Model {

  constructor( props ) {
    this.props = props; 
    if ( props.id ) {
      this.id = props.id;
    }
  }

  get( key ) {
    return this.props[ key ];
  }

  fetch() {
    return new Promise( (resolve, reject) => {

      if (!this.id) {
        reject( 'ID undefined');
      }

      request.get( process.env.API_BASE + this.url + '/' + this.id, (error, response, body) => {
        if (error || response.statusCode < 200 || response.statusCode >= 300 )  {
          reject( error ) ;
        } else {
          this.props = JSON.parse(body).data;
          resolve( body );
        }
      })

    });
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
