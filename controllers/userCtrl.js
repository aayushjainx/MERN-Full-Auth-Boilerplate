const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
	register: async (req, res, next) => {
		try {
			const { name, email, password } = req.body;

			if (!name || !email || !password) return res.status(400).json({ msg: 'Please fill in all fields' });

			if (!validateEmail(email)) return res.status(400).json({ msg: 'Invalid email' });

			const user = await User.findOne({ email });
			if (user) res.status(400).json({ msg: 'This email already exists' });

			if (password.length < 6) res.status(400).json({ msg: 'Password must be atleast 6 characters' });

			const passwordHash = await bcrypt.hash(password, 12);

			const newUser = { name, email, password: passwordHash };

			const activation_token = createActivationToken(newUser);

			const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`;
			Sendmail(email, url);

			res.json({ msg: 'Register Success! Please activate your email to start.' });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' });
};

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
