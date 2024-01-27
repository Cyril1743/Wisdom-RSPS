const jwt = require('jsonwebtoken');

const secret = "superSecretNuclearCodesThatCouldEndTheWorldDontYouDareEverLookAtThisSecretOrYouJustMightEndHumanity";
const expiration = "48h";

module.exports = {
    authmiddleware: function ({req}) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        } catch {
            console.log("Invalid token");
        }

        return req;
    },
    signToken: function ({email, username, id, isForumAdmin}) {
        console.log(email,username,id,isForumAdmin)
        const payload = {email: email, username: username, id: id, isForumAdmin: isForumAdmin};
        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    }
};