/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { User } from "../types";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred during login.",
      }
    );
  }
};

const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username: name,
      email,
      password,
    });
    return response.data.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred during registration.",
      }
    );
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while fetching the profile.",
      }
    );
  }
};

const updateProfile = async (userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.AUTH.UPDATE_PROFILE,
      userData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while updating the profile.",
      }
    );
  }
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while changing the password.",
      }
    );
  }
};

const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};
export default authService;
