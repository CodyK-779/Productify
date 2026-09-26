import { useCreateComment } from "@/hooks/useComments";
import type { CommentWithUser, Session } from "@/types";
import { Loader2, LogInIcon, MessageSquareIcon, SendIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "./ui/toast";
import DeleteComment from "./DeleteComment";
import { Img } from "@page-speed/img";

interface Props {
  productId: string;
  comments: CommentWithUser[];
  session: Session;
  currentUserId: string | undefined;
}

const CommentSection = ({
  productId,
  comments,
  session,
  currentUserId,
}: Props) => {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateComment();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim())
      return toast.add({ type: "warning", description: "Comment is empty" });

    try {
      mutate(
        { content, productId },
        {
          onSuccess: () => {
            setContent("");
            toast.add({
              type: "success",
              description: "Comment posted successfully!",
            });
          },
          onError: (err) => {
            toast.add({ type: "error", description: err.message });
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-5 text-primary" />
        <h3 className="font-bold">Comments</h3>
        <span className="badge badge-neutral badge-sm">{comments.length}</span>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered input-sm flex-1 bg-base-200"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-square"
            disabled={!content.trim() || isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">
          <span className="text-sm text-base-content/60">
            Sign in to join the conversation
          </span>
          <Link to="/login" className="btn btn-primary btn-sm gap-1">
            <LogInIcon className="size-4" />
            Sign In
          </Link>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <MessageSquareIcon className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet. Be first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="chat chat-start">
              <div className="chat-image avatar">
                <div className="size-8 rounded-full overflow-hidden flex items-center justify-center bg-primary">
                  {comment.user.image ? (
                    <Img
                      src={comment.user.image}
                      alt={comment.user.name}
                      className="object-cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="chat-header text-xs opacity-70 mb-2">
                {comment.user?.name}
                <time className="ml-2 text-xs opacity-50">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="chat-bubble chat-bubble-neutral text-sm">
                {comment.content}
              </div>

              {currentUserId === comment.userId && (
                <div className="chat-footer">
                  <DeleteComment commentId={comment.id} productId={productId} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
