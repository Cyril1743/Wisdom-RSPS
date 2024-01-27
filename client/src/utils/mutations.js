import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            id
            username
        }
    }
}`

export const ADDUSER = gql`
mutation addUser($username: String!, $email: String!, $password: String!, $allowContact: Boolean) {
    addUser(email: $email, username: $username, password: $password, allowContact: $allowContact){
        token
        user {
            id
            username
        }
    }
}`

export const ADDRESETREQUEST = gql`
mutation addPasswordReset($email: String!) {
    addPasswordReset(email: $email){
        id
    }
}`

export const UPDATEPASSWORDRESET = gql`
mutation updatePasswordReset($id: String!, $newPassword: String!){
    updatePasswordReset(id: $id, newPassword: $newPassword){
        id
    }
}`

export const PINPOST = gql`
mutation pinPost($postId: Int!){
    pinPost(postId: $postId){
        id
    }
}`

export const UNPINPOST = gql`
mutation unpinPost($postId: Int!){
    unpinPost(postId: $postId){
        id
    }
}`

export const NEWPOST = gql`
mutation addPost($title: String!, $text: String!, $image: String, $catagory: String){
    addPost(title: $title, text: $text, image: $image, catagory: $catagory){
        id
    }
}`