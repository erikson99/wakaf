import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DonationDataTable } from "@/components/admin/donation-data-table"
import { AdminHeader } from "@/components/admin/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { HandCoins, Users } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.user.id)
    .single()

  if (adminError || !adminUser) {
    redirect("/admin/login")
  }

  // Fetch all donations
  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch all admin users
  const { data: adminUsers, error: adminUsersError } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false })

  if (donationsError) {
    console.error("Error fetching donations:", donationsError)
  }

  if (adminUsersError) {
    console.error("Error fetching admin users:", adminUsersError)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-green-700">
      <AdminHeader userEmail={user.user.email || ""} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="donations" className="text-green-900">
              <HandCoins className="h-4 w-4 text-yellow-700" />
              Wakaf</TabsTrigger>
            <TabsTrigger value="users" className="text-green-700">
              <Users className="h-4 w-4 text-yellow-700" />
              Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-green-900">Manajemen Wakaf</h1>
              <p className="mt-2 text-green-600">View and manage all wakaf registrations</p>
            </div>
            <DonationDataTable initialData={donations || []} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-green-900">User Management</h1>
              <p className="mt-2 text-gray-600">Add and remove admin users</p>
            </div>
            <UserManagement initialUsers={adminUsers || []} currentUserId={user.user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
