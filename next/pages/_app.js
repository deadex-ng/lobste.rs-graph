import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client';

const createApolloClient = () => {
  const link = new HttpLink({
    uri: '/api/graphql'
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
};

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={createApolloClient()}>
      <Component {...pageProps} />)
    </ApolloProvider>
  );
}

export default MyApp;
// import '../styles/globals.css'

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// export default MyApp
