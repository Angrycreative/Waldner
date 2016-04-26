import request from 'request';
import Model from '../models/Model.js';

export default class Store {

  constructor( data, ModelClass ) {
    this.ModelClass = ModelClass || Model;
    this.rawData = data;
    this.models = [];

    if (data) {
      this.parseData( data );
    }
  }

  // Fetch all models on current index endpoint
  fetch( url ) {

    return new Promise( (resolve, reject) => {

      url = url || this.ModelClass.url;
      request.get( process.env.API_BASE + url, (error, response, body) => {
        if ( error || response.statusCode < 200 || response.statusCode >= 300 ) {
          reject( error );
        } else {

          this.parseData( JSON.parse(body).data );
          resolve( body );
        }
      });

    });

  }

  parseData( data ) {
    if (!data) { return; }

    // Loop every instance and create new Model objects
    this.models = [];
    for (let i = 0; i < data.length; i++) {
      let model = new this.ModelClass();
      model.props = data[i];
      // If ID is found we want to set it to the core object
      model.id = model.props.id;
      this.models.push( model );
    }
  }

  // Fetch with 'where' query
  where( key, value ) {
    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i].props[key] === value) {
        return this.models[i];
      }
    }
    return null;
  }

  // Shorthand for fetching with where
  getById( id ) {
    return this.where('id', id);
  }

}
