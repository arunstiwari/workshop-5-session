import React, {useState} from 'react';
import {useMutation} from "@apollo/client";

import { MutationCreatePicture, QueryListPictures } from "../GraphQL";
import { v4 as uuid } from 'uuid';

import { Form, Icon } from 'semantic-ui-react'

import { Auth } from "aws-amplify";
const initialState = {
  name: '',
  file: undefined,
  lastUpdate: new Date().toISOString()
}

const AddPhoto = ({options}) => {
  const [state, setState] = useState(initialState);

  const [createPicture, {data}] = useMutation(MutationCreatePicture);

  const handleChange = (field, event) => {
    const {target: {value,files}} = event;
    const [file,] = files || [];
    setState({
      [field]: file || value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {bucket, region} = options;
    const visibility = 'private';

    const { identityId } = await Auth.currentCredentials();
    const { username: owner } = await Auth.currentUserInfo();
    const {name, file: selectedFile} = state;
    let file;
    if (selectedFile) {
      const { name: fileName, type: mimeType } = selectedFile;
      const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(fileName);

      const key = `${visibility}/${identityId}/${uuid()}${extension && '.'}${extension}`;

      file = {
        bucket,
        key,
        region,
        mimeType,
        localUri: file,
      };
    }

    setState(initialState, () => {
      this.fileInput.value = "";
      this.props.createPicture({ name, owner, visibility, file });
    });
  }

  const isSubmitEnabled = () => {
    const isSubmitEnabled = state.name !== '' && state.file !== undefined;
    return isSubmitEnabled;
  }
  return (
    <fieldset>
      <Form onSubmit={handleSubmit}>
        <Form.Group >
          <Form.Input label="Friendly name" type="text" placeholder="Title" value={state.name} onChange={handleChange('name')} />
          <Form.Input key={state.lastUpdate} label="File to upload" type="file" onChange={handleChange('file')} />
          <Form.Button icon labelPosition="right" label="GraphQL mutation" type="submit" disabled={!isSubmitEnabled()}><Icon name="upload" />Add Photo</Form.Button>
        </Form.Group>
      </Form>
    </fieldset>
  );
};

export default AddPhoto;
