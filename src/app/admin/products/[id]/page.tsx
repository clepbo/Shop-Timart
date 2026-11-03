import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/store";
import { ProductForm } from "../ProductForm";
import { deleteProductAction } from "../../actions";

// AI renders run in the background after saving; give them time to finish on Vercel.
export const maxDuration = 300;


export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const product = await getProductById((await params).id);
  if (!product) notFound();
  return (
    <div className="container-x py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Edit product</p>
          <h1 className="display mt-2 text-5xl">{product.name}</h1>
        </div>
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <button className="text-[12px] uppercase tracking-[0.14em] text-red-700 hover:underline">Delete</button>
        </form>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
