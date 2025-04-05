import axios from "axios";
import Cookies from "js-cookie";

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

const refreshAxios = axios.create();

export const login = async (username: string, password: string) => {
   const data = { username, password };
   try {
      const response = await axios.post(`${API_SERVER}/auth/login`, data, {
         withCredentials: true,
      });
      return response;
   } catch (error) {
      console.error("Login error", error);
      throw error;
   }
};

export const register = async (
   username: string,
   password: string,
   email: string,
   displayname: string
) => {
   const data = { username, password, email, displayname };
   try {
      const response = await axios.post(`${API_SERVER}/auth/register`, data, {
         withCredentials: true,
      });
      return response;
   } catch (error) {
      console.error("Register error", error);
      throw error;
   }
};

export const logout = async () => {
   try {
      // Gọi API để thông báo logout lên server
      // await axios.post(
      //    `${API_SERVER}/auth/logout`,
      //    {},
      //    {
      //       withCredentials: true,
      //       headers: {
      //          Authorization: `Bearer ${Cookies.get("access_token")}`,
      //       },
      //    }
      // );

      // Xóa cookies chứa các token
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });

      // Điều hướng về trang login hoặc xử lý giao diện logout
      window.location.href = "/";
   } catch (error) {
      console.error("Logout error", error);

      // Dù có lỗi, vẫn xóa token trên client
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      window.location.href = "/auth";
   }
};

export const checkTokenAndRedirect = (router: any) => {
   const token = Cookies.get("access_token");
   if (token) {
      router.push("/task-manager");
   }
};

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
   try {
      // Sử dụng instance riêng để tránh interceptor bắt request này
      const response = await refreshAxios.post(
         `${API_SERVER}/auth/refresh-token`,
         {},
         {
            withCredentials: true,
            headers: {
               Authorization: `Bearer ${refreshToken}`,
            },
         }
      );

      return response.data.access_token;
   } catch (error) {
      console.error("Error refreshing access token", error);
      throw error;
   }
};

axios.interceptors.request.use(
   (config) => {
      const token = Cookies.get("access_token");
      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

axios.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true; // Đánh dấu request này đã được retry
         const refreshToken = Cookies.get("refresh_token");

         if (refreshToken) {
            try {
               // Lấy access token mới
               const newAccessToken = await refreshAccessToken(refreshToken);

               // Lưu access token mới vào cookie
               Cookies.set("access_token", newAccessToken, {
                  expires: 30,
                  path: "/",
               });

               // Cập nhật header Authorization với access token mới
               originalRequest.headers[
                  "Authorization"
               ] = `Bearer ${newAccessToken}`;

               // Thực hiện lại request ban đầu với access token mới
               return axios(originalRequest);
            } catch (refreshError) {
               console.error("Refresh token failed", refreshError);

               // Xử lý khi refresh token không hợp lệ (có thể logout hoặc redirect)
               Cookies.remove("access_token", { path: "/" });
               Cookies.remove("refresh_token", { path: "/" });
               window.location.href = "/auth";

               return Promise.reject(refreshError);
            }
         } else {
            // Không có refresh token, có thể logout hoặc redirect
            console.error("No refresh token available");
            window.location.href = "/auth";
         }
      }

      // Trả về lỗi nếu không phải lỗi 401 hoặc đã xử lý thất bại
      return Promise.reject(error);
   }
);

export default axios;