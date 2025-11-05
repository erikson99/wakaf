import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorageBucket() {
  try {
    console.log("Setting up Supabase Storage bucket...")

    // Create the bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === "proof-of-transfer")

    if (!bucketExists) {
      console.log("Creating 'proof-of-transfer' bucket...")
      const { data, error } = await supabase.storage.createBucket("proof-of-transfer", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
      })

      if (error) {
        console.error("Error creating bucket:", error)
        process.exit(1)
      }

      console.log("Bucket created successfully:", data)
    } else {
      console.log("Bucket 'proof-of-transfer' already exists")
    }

    console.log("Storage bucket setup complete!")
  } catch (error) {
    console.error("Setup error:", error)
    process.exit(1)
  }
}

setupStorageBucket()
