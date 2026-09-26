import CommentSection from "@/components/CommentSection";
import DeleteProduct from "@/components/DeleteProductWrapper";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetProductById } from "@/hooks/useProducts";
import { useSession } from "@/lib/auth-client";
import { Img } from "@page-speed/img";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { useParams, Link } from "react-router";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const { data: product, error, isPending } = useGetProductById(id!);

  if (isPending) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = product.userId === session?.user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${product.id}`}
              className="btn btn-ghost btn-sm gap-1"
            >
              <EditIcon className="size-4" /> Edit
            </Link>
            <DeleteProduct productId={product.id} path="/">
              <button className="btn btn-error btn-sm gap-1">
                <Trash2Icon className="size-4" />
                Delete
              </button>
            </DeleteProduct>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="card bg-base-300 p-3 w-full h-auto rounded-xl overflow-hidden">
          <Img
            src={product.image}
            alt={product.title}
            className="object-cover rounded-lg"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{product.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name}
              </div>
            </div>

            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">
              {product.description}
            </p>

            {product.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="size-12 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center rounded-full overflow-hidden">
                    {product.user.image ? (
                      <Img
                        src={product.user.image}
                        alt={product.user.name}
                        className="object-cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <span className="font-bold sm:text-lg text-base">
                        {product.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentSection
            productId={product.id}
            comments={product.comments}
            session={session}
            currentUserId={session?.user.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
