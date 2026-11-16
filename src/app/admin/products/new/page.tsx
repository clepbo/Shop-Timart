import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { ProductForm } from "../ProductForm";
import { AdminHeader } from "@/components/admin/AdminShell";

// AI renders run in the background after saving; give them time to finish on Vercel.
export const maxDuration = 300;


export default async function NewProduct() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="container-x py-10">
      <AdminHeader back={{ href: "/admin", label: "Products" }} title="New product" description="Add a piece to the collection. Nothing is published until you press Publish." />
      <ProductForm />
    </div>
  );
}
