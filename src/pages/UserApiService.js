import api from '.././Frontend_API';

export const fetchUserInfo = () => {
  return api.get('/user/info');
};