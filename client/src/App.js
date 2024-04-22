import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { setContext } from "@apollo/client/link/context";
//eslint-disable-next-line
import bootstrap from 'bootstrap';
import "./styles/styles.css"

import NavBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from "./pages/SignUp";
import PasswordReset from './pages/PasswordReset';
import Forums from './pages/Forums';
import Forum from './pages/Forum';
import Post from './pages/Post';
import Shop from './pages/Shop';

const httpLink = createHttpLink({
  uri: "/graphql"
})

const authLink = setContext((_, { headers }) => {
  //get the auth token from local storage
  const token = localStorage.getItem('id_token');
  //return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  //Set up our client to execute the authLink middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default function App() {
  return (
    <div className='background'>
      <ApolloProvider client={client}>
        <ChakraProvider>
          <Router>
            <NavBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/passwordreset' element={<PasswordReset />} />
              <Route path='/passwordreset/:passwordResetId' element={<PasswordReset />} />
              <Route path='/forum' element={<Forums />} />
              <Route path='/forum/:forumId' element={<Forum />} />
              <Route path='/forum/:forumId/post/:postId' element={<Post />} />
              <Route path='/store' element={<Shop />} />
              <Route path='/store/:state' element={<Shop />} />
            </Routes>
          </Router>
        </ChakraProvider>
      </ApolloProvider>
    </div>
  );
}
