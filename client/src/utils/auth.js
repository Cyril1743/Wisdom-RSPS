import decode from 'jwt-decode';

class AuthService {
    getUser() {
        return decode(this.getToken());
    }

    getUsername() {
        if (this.loggedIn()){
            return this.getUser().data.username
        }
    }

    //return 'true' or 'false' if token exists and has not expired.
    loggedIn() {
        const token = this.getToken();
        return token && !this.isTokenExpired(token) ? true : false;
    }

    isTokenExpired(token) {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('id_token');
            return true
        }
        return false
    }

    //Retrieve user token from LocalStorage
    getToken() {
        return localStorage.getItem("id_token");
    }

    login(idToken) {
        localStorage.setItem("id_token", idToken);
    }

    isForumAdmin() {
        if(this.loggedIn()){
        return this.getUser().data.isForumAdmin
    }
    }

    //Clear user token and profile data from localStorage
    logout() {
        localStorage.removeItem('id_token');
        window.location.reload();
    }
}

// eslint-disable-next-line
export default new AuthService()