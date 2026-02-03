import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Users = () => {
  const { backendURL, token, user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  

  /* ===============================
     FETCH USERS (SuperAdmin only)
  =============================== */
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/users/allUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "superAdmin") {
      fetchUsers();
    }
  }, []);

  /* ===============================
     CONFIRM ROLE CHANGE
  =============================== */
  const confirmRoleChange = async () => {
    try {
      await axios.put(
        `${backendURL}/api/users/${pendingRoleChange.userId}/role`,
        { role: pendingRoleChange.newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("User role updated successfully");
      setPendingRoleChange(null);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update role"
      );
      setPendingRoleChange(null);
    }
  };

  const cancelRoleChange = () => {
    setPendingRoleChange(null);
  };

  if (loading) {
    return <p className="text-slate-500">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">
        User Management
      </h1>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-4 font-semibold text-slate-800">
                  {u.name}
                </td>

                <td className="p-4 text-slate-600">
                  {u.email}
                </td>

                <td className="p-4">
                  {u.role === "superAdmin" ? (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-600">
                      superAdmin
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        setPendingRoleChange({
                          userId: u._id,
                          newRole: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="viewer">viewer</option>
                      <option value="author">author</option>
                      <option value="editor">editor</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="p-6 text-center text-slate-500">
            No users found
          </p>
        )}
      </div>

      {/* ===============================
         ROLE CHANGE CONFIRMATION MODAL
      =============================== */}
      {pendingRoleChange && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Confirm Role Change
            </h2>

            <p className="text-sm text-slate-600">
              Are you sure you want to change this user's role to{" "}
              <span className="font-semibold">
                {pendingRoleChange.newRole}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={cancelRoleChange}
                className="px-4 py-2 rounded-lg border text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
