import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.PROGRESS.DASHBOARD);
    return response.data;
    } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while fetching dashboard data.",
        }
    );
  }
};

const progressServices = {  
    getDashboardData,
};
export default progressServices;