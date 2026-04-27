"use client"

import { useState } from "react"
import { UserPlus, Shield, User as UserIcon, Mail, Trash2, Edit } from "lucide-react"
import UserModal from "./UserModal"
import { deleteUser } from "@/lib/actions/users"

export default function UserList({ initialUsers, suppliers }: { initialUsers: any[], suppliers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">Manage system administrators and suppliers.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all text-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{user.name || "Unnamed User"}</p>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-0.5">
                        <Mail className="w-2.5 h-2.5" />{user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    user.role === "SUPER_ADMIN" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"
                  }`}>
                    <Shield className="w-3 h-3" />{user.role}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-bold text-indigo-600 font-mono">
                    {user.role === "SUPER_ADMIN" ? "ADMIN" : (user.supplier?.code || "-")}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── MOBILE CARD LIST ─── */}
      <div className="md:hidden space-y-2">
        {initialUsers.map((user: any) => (
          <div key={user.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 flex-shrink-0">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm leading-tight">{user.name || "Unnamed User"}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(user)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 pb-3">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                user.role === "SUPER_ADMIN" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"
              }`}>
                <Shield className="w-2.5 h-2.5" />{user.role}
              </div>
              <span className="text-[9px] font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                {user.role === "SUPER_ADMIN" ? "ADMIN" : (user.supplier?.code || "-")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserModal 
          user={editingUser} 
          suppliers={suppliers}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
