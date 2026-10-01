import { Link, useNavigate } from "react-router";
import { useGetMyProducts } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  PlusIcon,
  PackageIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import DeleteProductWrapper from "@/components/DeleteProductWrapper";
import { Img } from "@page-speed/img";
import { useState } from "react";
import EditProduct from "@/components/EditProduct";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const { data: products, isPending } = useGetMyProducts();

  if (isPending) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-base-content/60 text-sm">Manage your listings</p>
        </div>
        <Link to="/create" className="btn btn-primary btn-sm gap-1">
          <PlusIcon className="size-4" /> New
        </Link>
      </div>

      {/* Stats */}
      <div className="stats bg-base-300 w-full">
        <div className="stat">
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">{products?.length || 0}</div>
        </div>
      </div>

      {/* Products */}
      {products && products.length > 0 ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="card card-side bg-base-300 overflow-hidden"
            >
              <div className="size-32 shrink-0">
                <Img
                  src={product.image}
                  alt={product.title}
                  className="object-cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="card-body p-4">
                <h2 className="card-title text-base">{product.title}</h2>
                <p className="text-sm text-base-content/60 line-clamp-1">
                  {product.description}
                </p>
                <div className="card-actions justify-end mt-2">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="btn btn-ghost btn-xs gap-1"
                  >
                    <EyeIcon className="size-3" /> View
                  </button>
                  <button
                    onClick={() => setShowDialog(true)}
                    className="btn btn-ghost btn-xs gap-1"
                  >
                    <EditIcon className="size-3" /> Edit
                  </button>
                  <EditProduct
                    open={showDialog}
                    setOpen={setShowDialog}
                    product={product}
                  />
                  <DeleteProductWrapper productId={product.id} path="/profile">
                    <button className="btn btn-ghost btn-xs text-error gap-1">
                      <Trash2Icon className="size-3" /> Delete
                    </button>
                  </DeleteProductWrapper>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-300">
          <div className="card-body items-center text-center py-16">
            <PackageIcon className="size-16 text-base-content/20" />
            <h3 className="card-title text-base-content/50">No products yet</h3>
            <p className="text-base-content/40 text-sm">
              Start by creating your first product
            </p>
            <Link to="/create" className="btn btn-primary btn-sm mt-4">
              Create Product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
