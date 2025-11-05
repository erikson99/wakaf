"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface AdminUser {
  id: string
  email: string
  created_at: string
}

interface UserManagementProps {
  initialUsers: AdminUser[]
  currentUserId: string
}

export function UserManagement({ initialUsers, currentUserId }: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add user")
      }

      const newUser = await response.json()
      setUsers((prev) => [newUser, ...prev])
      setNewUserEmail("")
      setNewUserPassword("")
      setIsAddingUser(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setDeletingUserId(null)
    } catch (err) {
      alert("Error deleting user: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  return (
    <div className="space-y-6">
      {/* Add User Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddingUser(true)} className="gap-2 text-md text-yellow-300 bg-green-600 hover:bg-green-700" style={{ cursor: 'pointer' }}>
          <Plus className="h-4 w-4" />
          Add Admin User
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No admin users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <TableCell className="px-6 py-4 text-sm text-gray-900">{user.email}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingUserId(user.id)}
                      disabled={user.id === currentUserId}
                      className="gap-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingUser(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deletingUserId && (
        <Dialog open onOpenChange={() => setDeletingUserId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Admin User</DialogTitle>
            </DialogHeader>

            <p className="text-gray-600">
              Are you sure you want to delete this admin user? This action cannot be undone.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingUserId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteUser(deletingUserId)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
