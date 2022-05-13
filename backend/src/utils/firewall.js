import { getDataFromToken } from './jwt-utils';

const firewallConfig = [
  {
    route: '/',
    isAuthNeeded: false,
    acceptedRoles: ['user', 'admin'],
  },
  {
    route: '/login',
    isAuthNeeded: false,
    acceptedRoles: ['user', 'admin'],
  },
  {
    route: '/posts',
    isAuthNeeded: true,
    acceptedRoles: ['user', 'admin'],
  },
  {
    route: '/dashboard',
    isAuthNeeded: true,
    acceptedRoles: ['admin'],
  },
];

const firewallMiddlewre = async (req, res, next) => {
  const renderError = (error) => {
    res.render('error.ejs', {error});
  }

  let path = req.path;
  if (path.trim().endsWith('/') && path !== '/') {
    path = req.path.trim().slice(0, -1);
  }

  if (req.path.startsWith('/api')) {
    return next()
  }

  const pathConfig = firewallConfig.find(config => config.route === path);
  if (!pathConfig) {
    return renderError('Page not found');
  }

  if (pathConfig.isAuthNeeded) {
    const { token } = req.cookies;

    if (token == null) return renderError('You are not authorized');

    const user = await getDataFromToken(token)

    if (user === null) {
      return renderError('Could not extract user from token');
    }
  
    if (!pathConfig.acceptedRoles.includes(user.role)) {
      return renderError('You are not allow to access this page');
    }
  }

  next();
};

export default firewallMiddlewre;
