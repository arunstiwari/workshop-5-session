import React, {Component} from 'react';
import {useQuery} from "@apollo/client";
import {QueryListPictures} from "../graphql";
import { Icon, Table, Button, Loader } from 'semantic-ui-react';
import { Storage } from 'aws-amplify';

const AllPhotos = () => {
  const {loading, error, data} = useQuery(QueryListPictures);
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>
  const {listPictures: photos} = data;

  const handleDownload = async ({visibility: level, file}) => {
    try {
      const { bucket, region, key } = file;
      const [, , keyWithoutPrefix] = /([^/]+\/){2}(.*)$/.exec(key) || key;

      const url = await Storage.get(keyWithoutPrefix, { bucket, region, level });

      window.open(url);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <React.Fragment>
      <Table celled={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell><Icon name={'key'} /> PhotoId</Table.HeaderCell>
            <Table.HeaderCell><Icon name={'info'} />Friendly name</Table.HeaderCell>
            <Table.HeaderCell><Icon name={'eye'} />Visibility</Table.HeaderCell>
            <Table.HeaderCell><Icon name={'user'} />Owner</Table.HeaderCell>
            <Table.HeaderCell><Icon name={'calendar'} />Created at</Table.HeaderCell>
            <Table.HeaderCell> <Icon name={'download'} />Download</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {photos && photos.items && [].concat(photos.items).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(photo => (
            <Table.Row key={photo.id}>
              <Table.Cell>{photo.file && photo.id}</Table.Cell>
              <Table.Cell>{photo.name}</Table.Cell>
              <Table.Cell>{photo.visibility}</Table.Cell>
              <Table.Cell>{photo.owner}</Table.Cell>
              <Table.Cell>{photo.file && photo.createdAt}</Table.Cell>
              <Table.Cell>
                {photo.file? <Button icon labelPosition="right" onClick={handleDownload( photo)}><Icon name="download" />Download</Button> : <Loader inline='centered' active size="tiny" />}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
}

export default AllPhotos;
