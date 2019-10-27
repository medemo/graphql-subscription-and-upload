import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'


/**
 * 
 * apollo-boost does not support subscription, so you need to import all of those stuffs above 
 * and configure the the apollo link manually
 * 
 */


const client = new ApolloClient({
  link: split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    new WebSocketLink({
      uri: `ws://localhost:4000`,
      options: {
        reconnect: true,
        connectionParams: {
          token: 'abcde'
        }
      }
    }),
    new HttpLink({
      uri: 'http://localhost:4000',
      credentials: 'same-origin'
    }),
  ),
  cache: new InMemoryCache()
});

export const uploadClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ uri: 'http://localhost:4000' })
})

export default client