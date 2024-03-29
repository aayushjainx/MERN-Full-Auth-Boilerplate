import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ActivationEmail from './auth/ActivationEmail';
import Login from './auth/Login';
import Register from './auth/Register';
import { useSelector } from 'react-redux';
import NotFound from '../utils/notfound/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Profile from './profile/Profile';
import EditUser from './profile/EditUser';
import Home from './home/Home';

function Body() {
	const auth = useSelector((state) => state.auth);
	const { isLogged, isAdmin } = auth;
	return (
		<section>
			<Switch>
				<Route path='/' component={Home} exact />
				<Route path='/login' component={isLogged ? NotFound : Login} exact />
				<Route path='/register' component={isLogged ? NotFound : Register} exact />
				<Route path='/forgot_password' component={isLogged ? NotFound : ForgotPassword} exact />
				<Route path='/user/reset/:reset_token' component={isLogged ? NotFound : ResetPassword} exact />
				<Route exact path='/user/activate/:activation_token' component={ActivationEmail} />
				<Route path='/profile' component={!isLogged ? NotFound : Profile} exact />
				<Route path='/edit_user/:id' component={!isAdmin ? NotFound : EditUser} exact />
			</Switch>
		</section>
	);
}

export default Body;
