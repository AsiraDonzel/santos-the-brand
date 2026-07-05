import axios from "./axiosInstance";

const AccountAPI = {
  signUp: async (userData: any) => {
    try {
        const response = await axios.post("/admin/signup", userData);
        return response.data;
    } catch (error) {
        console.error("An error occured", error);
        
    }
  },
  signIn: async (userData: any) => {
    try {
        const response = await axios.post("/admin/login", userData);
        return response.data;
    } catch (error) {
        console.error("An error occured", error);
        
    }
  },
  changePassword: async (passwordData: any) => {
    try {
        const response = await axios.post("/admin/change-password", passwordData);
        return response.data;
    } catch (error) {
        console.error("An error occured", error);
        
    }
  },
};

export default AccountAPI;
