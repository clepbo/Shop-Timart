import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { ProductForm } from "../ProductForm";

// AI renders run in the background after saving; give them time to finish on Vercel.
export const maxDuration = 300;


export default async function NewProduct() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="container-x py-10">
      <p className="eyebrow">New product</p>
      <h1 className="display mt-2 text-5xl">Add to the collection</h1>
      <ProductForm />
    </div>
  );
}
