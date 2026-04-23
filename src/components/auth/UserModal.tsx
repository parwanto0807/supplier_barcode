"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createUser, updateUser } from "@/lib/actions/users"
import { Role } from "@prisma/client"

interface UserModalProps {
  user?: any
  suppliers: any[]
  onClose: () => void
}

export default function UserModal({ user, suppliers, onClose }: UserModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role || "SUPPLIER")
  const isEditing = !!user

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isEditing) {
        await updateUser(user.id, formData)
      } else {
        await createUser(formData)
      }
      onClose()
    } catch (error) {
      alert("Error saving user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900">{isEditing ? "Edit User" : "Add New User"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              name="name"
              defaultValue={user?.name}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              {isEditing ? "New Password (Optional)" : "Password"}
            </label>
            <input
              name="password"
              type="password"
              required={!isEditing}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Access Level</label>
              <select
                name="role"
                defaultValue={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium bg-white text-slate-900"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SUPPLIER">Supplier</option>
              </select>
            </div>

            {selectedRole === "SUPPLIER" && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-semibold text-slate-700">Linked Supplier</label>
                <select
                  name="supplierId"
                  defaultValue={user?.supplierId}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium bg-white text-slate-900"
                >
                  <option value="">Select Company...</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Update User" : "Create User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
