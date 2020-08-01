import {gql} from '@apollo/client';

export default gql`
  query {
    listPictures(limit: 100) {
      items {
        id
        name
        visibility
        owner
        createdAt
        file {
          bucket
          region
          key
        }
      }
    }
  }
`
