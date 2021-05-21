const bcrypt = require('bcryptjs');

function signUp(req, res) {
  const { email, password } = req.body;
  const db = req.app.get('db');

  db.check_user_exists(email)
    .then((user) => {
      if (user[0]) {
        res.status(200).json('You have an account');
      } else {
        const hashedPassword = bcrypt.hashSync(password);
        db.create_user(email, hashedPassword)
          .then((user) => {
            const { id, email } = user[0];
            req.session.user = {
              id: id,
              email: email,
            };
            res.status(200).json(req.session.user);
          })
          .catch();
      }
    })
    .catch((err) => console.log(err));
}

module.exports = { signUp };
