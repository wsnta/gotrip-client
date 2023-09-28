import axios from 'axios';
import { serverHostIO } from 'utils/links/links';

const API_URL = `${serverHostIO}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

type TypeLoginInf = {
  accessToken: string,
  refreshToken: string,
  userId: string,
  accountType: string,
  email: string,
};

export const signup = async (displayName: string, username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/register', { username, password, displayName });
    return response.data;
  } catch (error) {
    throw new Error('Đăng ký không thành công');
  }
};


export const refreshAccessToken = async (): Promise<TypeLoginInf | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('Lỗi khi làm mới token')
    return null
  } else {
    try {
      const response = await axiosInstance.post('/token', { refreshToken });
      const {
        email, 
        accessToken, 
        userId, 
        accountType, 
      } = response.data;
      const typeData: TypeLoginInf = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        accountType: accountType,
        email: email,
      };
      return typeData;
    } catch (error) {
      console.error('Lỗi khi làm mới token')
      return null
    }
  }
};
