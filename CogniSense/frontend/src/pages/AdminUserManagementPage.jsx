import { useEffect, useState } from "react";
import { deleteAdminUser, getAdminUsers } from "../services/adminService";

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    getAdminUsers().then(setUsers).catch(() => setUsers([]));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    await deleteAdminUser(userId);
    loadUsers();
  };

  return (
    <div className="panel overflow-hidden">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/5 text-slate-300">
          <tr>
            <th className="px-5 py-4">Name</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Role</th>
            <th className="px-5 py-4">Created</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-5 py-4 text-white">{user.name}</td>
              <td className="px-5 py-4 text-slate-300">{user.email}</td>
              <td className="px-5 py-4 capitalize text-slate-300">{user.role}</td>
              <td className="px-5 py-4 text-slate-300">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  disabled={user.role === "admin"}
                  onClick={() => handleDelete(user._id)}
                  className="rounded-full bg-rose-500 px-4 py-2 text-white disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagementPage;

