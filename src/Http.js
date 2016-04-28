import request from 'request';

export default {

  get: function( url ) {

    return new Promise( (resolve, reject) => {
      
      request.get( url, (error, response, body) => {
        if ( body.errors ) {
          console.log('Error in GET', body.errors);
          reject( body.errors );
        } else {
          resolve( body );
        }
      });

    });

  },

  post: function( url, data ) {
    return new Promise( (resolve, reject) => {

      request.post({
        url: url,
        json: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      }, ( error, response, body ) => {
        if ( body.status === 'error' ) {
          console.log('Error in POST', body.errors);
          reject( body.errors )
        } else {
          resolve( body );
        }
      });
    });
  }

}
