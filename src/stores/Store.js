import request from 'request';
import Model from '../models/Model.js';
import Http from '../Http.js';

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
      Http.get( process.env.API_BASE + url )
        .then( data => {
          this.parseData( JSON.parse(data).data );
          resolve( data );
        })
        .catch( err => {
          reject( err ) ;
        })

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
