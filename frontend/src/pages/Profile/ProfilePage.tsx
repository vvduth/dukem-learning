/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spiner from "../../components/common/Spiner";
import authService from "../../services/authService";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewpassword, setConfirmNewpassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewpassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewpassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Spiner />;
  }

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="space-y-8">
        {/* User information display */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            User Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center
                pointer-events-none"
                >
                  <User className="h-4 w-4 text-neutral-400" />
                </div>
                <p
                  className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg
                bg-neutral-50 text-sm text-neutral-900"
                >
                  {username}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-400" />
                </div>
                <p
                  className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg
                bg-neutral-50 text-sm text-neutral-900"
                >
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* change password section */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Change password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white
                  text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-transparent focus:ring-violet-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 border border-neutral-200 
                  rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400
                  transition-colors duration-150 focus:outline-none focus:ring-2"
                  required
                />
              </div>
            </div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Confirm new Password
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 
              flex items-center pointer-events-none"
              >
                <Lock className="h-4 w4 text-neutral-400" />
              </div>
              <input
                type="password"
                value={confirmNewpassword}
                onChange={(e) => setConfirmNewpassword(e.target.value)}
                className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg
                bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors
                duration-150 focus:outline-none focus:ring-[#7C3AED] focus:ring-2
                focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disable={passwordLoading}>
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
