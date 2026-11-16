import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/store";
import { ProductForm } from "../ProductForm";
import { deleteProductAction } from "../../actions";
import { AdminHeader } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import Link from "next/link";

// AI renders run in the background after saving; give them time to finish on Vercel.
export const maxDuration = 300;


export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const product = await getProductById((await params).id);
  if (!product) notFound();
  return (
    <div className="container-x py-10">
      <AdminHeader back={{ href: "/admin", label: "Products" }} title={product.name} description="Edit this product. Changes go live when you press Save.">
        <Link href={`/shop/${product.slug}`} target="_blank" className="btn-outline !py-3">View in shop ↗</Link>
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmSubmit message={`Delete "${product.name}"? This can't be undone.`} className="btn border border-red-700/40 !py-3 text-red-700 hover:bg-red-700 hover:text-white">Delete</ConfirmSubmit>
        </form>
      </AdminHeader>
      <ProductForm product={product} />
    </div>
  );
}
