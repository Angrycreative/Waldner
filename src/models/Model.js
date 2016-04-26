import request from 'request';

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

      console.log('Fetch from', url);

      request.get( url, (error, response, body) => {
        if (error || response.statusCode < 200 || response.statusCode >= 300 )  {
          reject( error ) ;
        } else {
          this.props = JSON.parse(body).data;
          // console.log(this.props);
          resolve( body.data );
        }
      })

    });
  }

  save() {

    return new Promise( (resolve, reject) => {

      console.log(process.env.API_BASE + this.url);
      console.log('props', this.props);

      request.post({
        url: process.env.API_BASE + this.url,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: this.props
      }, (error, response, body) => {
        if (error || response.statusCode < 200 || response.statusCode >= 300 )  {
          console.log('Statuscode', error);
          reject( error ) ;
        } else {
          this.props = body.data;
          resolve( body );
        }
      });

    });

  }

}
