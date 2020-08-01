import React from 'react';
import logo from './logo.svg';
import './App.css';

// Appsync and apollo libraries
import AWSAppSyncClient from 'aws-appsync';
import {Rehydrated} from "aws-appsync-react";
import ApolloProvider from 'react-apollo';

//Amplify
import Amplify, {Auth} from 'aws-amplify';
import {withAuthenticator} from "aws-amplify-react";

//Components

import awsconfig from './aws-exports';
import AllPhotos from "./components/AllPhotos";
import AddPhoto from "./components/AddPhoto";
// Amplify init

Amplify.configure(awsconfig);

const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
const S3_BUCKET_REGION = awsconfig.aws_user_files_s3_bucket_region
const S3_BUCKET_NAME = awsconfig.aws_user_files_s3_bucket
const AUTH_TYPE = awsconfig.aws_appsync_authenticationType

// AppSync client instantiation
const client = new AWSAppSyncClient({
  url: GRAPHQL_API_ENDPOINT_URL,
  region:GRAPHQL_API_REGION,
  auth: {
    type: AUTH_TYPE,
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  complexObjectsCredentials: () => Auth.currentCredentials()
})


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">AWS Amplify with AWS AppSync  </h1>
      </header>
      <div className="App-content">
        <AddPhoto />
        <AllPhotos />
      </div>
    </div>
  );
}

const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
)

