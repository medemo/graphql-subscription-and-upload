import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks'

import client from './graphql'
import Subscription from './components/Subscription'
import Upload from './components/Upload'


function App() {
  return (
    <ApolloProvider client={client}>
      <Subscription />
      <br />
      <br />
      <Upload />
    </ApolloProvider>
  );
}

export default App;
