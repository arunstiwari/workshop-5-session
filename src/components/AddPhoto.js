import React, {Component} from 'react';
import {graphql} from "react-apollo";
import {MutationCreatePicture, QueryListPictures} from "../graphql";
import {v4 as uuid} from 'uuid';
import {Auth} from 'aws-amplify';

class AddPhoto extends Component {
  constructor(props) {
    super(props);
    // this.state = getInitialState();
    this.fileInput = {};
  }

  getInitialState(){

  }


  render() {
    return (
      <div>

      </div>
    );
  }
}

export default AddPhoto;
