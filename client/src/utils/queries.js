import { gql } from "@apollo/client";

export const CHECKUSERNAME = gql`
query userByUsername($username: String!) {
    userByUsername(username: $username) {
            id
            username      
    }
}`

export const CHECKEMAIL = gql`
query userByEmail($email: String!) {
    userByEmail(email: $email) {
            id
            email
    }
}`

export const CHECKRESET = gql`
query passwordReset($id: String!) {
    passwordReset(id: $id){
        id
        used
        user {
            email
        }
    }
}`

export const CHECKFORUMCATAGORIES = gql`
query forumCatagories {
    forumCatagories {
        id
        title
        catagoryDescription
        posts {
            id
            title
            user {
                username
            }
            pinned
            text
            createdAt
        }
    }
}`

export const CHECKFORUMCATAGORY = gql`
query forumCatagory($id: Int!, $offset: Int) {
    forumCatagory(id: $id, offset: $offset){
        id
        title
        catagoryDescription
        posts {
            id
            title
            user {
                username
            }
            pinned
            text
            createdAt
        }
    }
}`

export const CHECKPOST = gql`
query post($postId: Int!){
    post(postId: $postId) {
        id
        title
        text
        image
        user {
            username
        }
        allowComments
        createdAt
        comments {
            id
            text
            image
            user {
                username
            }
            createdAt
        }
    }
}`