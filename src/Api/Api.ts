import axios from 'axios';
import storage, {storageKeys} from '../database';

const BASE_URL = 'https://truyenyy.vip/api/';

const GET_TOKEN = 'token/';

const REFRESH_TOKEN = 'token/refresh/';

axios.interceptors.request.use(config => {
  const headers = config.headers as any;
  const userAgent = JSON.parse(
    JSON.parse(storage.getString(storageKeys.USER_AGENT) || ''),
  );
  console.log('userAgent', userAgent);
  headers['User-Agent'] = userAgent;
  return config;
});

const refreshHandle = (url: string, data: string) => {
  return refreshToken(storage.getString(storageKeys.REFRESH_TOKEN)!)
    .then((res: any) => {
      if (!res.data?.Success) {
        return;
      }
      storage.set(storageKeys.ACCESS_TOKEN, res.data.data.access);
      storage.set(storageKeys.REFRESH_TOKEN, res.data.data.refresh);
      return sendNotification(url, res.data.data.access, data);
    })
    .catch(e => {
      throw e;
    });
};

export const getAccessToken = (username: string, password: string) => {
  return axios
    .post(BASE_URL + GET_TOKEN, {
      username: username,
      password: password,
    })
    .then(response => {
      return response.data;
    });
};

export const refreshToken = (refresh: string) => {
  return axios
    .post(BASE_URL + REFRESH_TOKEN, {
      refresh: refresh,
    })
    .then(response => response.data);
};

export const sendNotification: (
  url: string,
  token: string,
  data: any,
) => any = (url, token, data) => {
  console.log('sendNotification', url, token, data);
  return axios
    .post(url, data, {
      headers: {
        Authorization: 'JWT ' + token,
      },
    })
    .then(response => response.data)
    .catch(e => {
      if (e.response?.status === 401) {
        return refreshHandle(url, data);
      } else {
        throw e;
      }
    });
};

export const sendSms = (url: string, token: string, data: any) => {
  console.log('sendSms', url, token, data);
  return axios
    .post(url, data, {
      headers: {
        Authorization: 'JWT ' + token,
      },
    })
    .then(response => response.data)
    .catch(e => {
      if (e.response?.status === 401) {
        return refreshHandle(url, data);
      } else {
        throw e;
      }
    });
};
