import {gql} from '@apollo/client';

export default gql`
  mutation ($input: CreatePictureInput!) {
    createPicture(input: $input) {
      id
      name
      visibility
      owner
      createdAt
      file {
        region
        bucket
        key
      }
    }
  }`;
