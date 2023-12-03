import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://my-backend-app.eba-fnxkdfpj.us-east-1.elasticbeanstalk.com/api',
  baseURL: 'https://ad9602d9b700b48fda93568d92629479-564988623.us-east-1.elb.amazonaws.com/api',
});

export default api;
