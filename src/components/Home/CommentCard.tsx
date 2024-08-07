import { iComment, iMySession, iUser } from "@/types";
import {
  HeartIcon,
  UserIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ShowMore from "./ShowMore";
import UpdateModal from "./UpdateCommentModal";
import UpdateCommentModal from "./UpdateCommentModal";
import { toast } from "react-hot-toast";

interface Props {
  comment: iComment;
  setComments: React.Dispatch<React.SetStateAction<iComment[]>>;
  setCommentTotal: React.Dispatch<React.SetStateAction<number>>;
}

const CommentCard: React.FC<Props> = ({
  comment,
  setComments,
  setCommentTotal,
}) => {
  useEffect(() => {
    setIsLiked(comment.isLiked);
    setTotalLikes(Number(comment.totalLikes));
  }, []);

  const session = useSession();
  const user = session.data?.user as iMySession;
  const [isLiked, setIsLiked] = useState<boolean>();
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const handleLike = async () => {
    const res = await fetch("/api/user/post/comment/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        isLiked,
        commentId: comment.commentId,
        userId: user.id,
      }),
    });

    if (res.status === 500) {
      toast.error("Something Went Wrong");
      return;
    }

    setTotalLikes((prev) => {
      if (isLiked) {
        if (!prev) {
          return 1;
        }

        return Number(prev) - 1;
      }
      return Number(prev) + 1;
    });

    setIsLiked((prev) => !prev);
  };

  const handleDeleteComment = async () => {
    const res = await fetch(`/api/user/post/comment/${comment.commentId}`, {
      method: "DELETE",
    });

    if (res.status === 500) {
      toast.error("Something Went Wrong");
      return;
    }

    setComments((prev) =>
      prev.filter((item) => item.commentId !== comment.commentId)
    );
    setCommentTotal((prev) => prev - 1);
  };

  return (
    <div className=" border rounded-lg p-3 mb-2">
      {/* Update Modal Start */}
      <UpdateCommentModal
        comment={comment}
        modalId="updateModal"
        setComments={setComments}
      />
      {/* Update Modal End */}
      <div className="flex items-center gap-2 ">
        <div className="avatar">
          <div className="w-10 rounded-full">
            {comment?.user?.avatar ? (
              <img src={comment.user.avatar} alt="" />
            ) : (
              <UserIcon />
            )}
          </div>
        </div>
        <h1>{comment.user.firstName + " " + comment.user.lastName}</h1>
        <h1> {"~ " + comment.createdAt}</h1>
        {user?.id === comment?.user?.userId && (
          <ShowMore handleDelete={handleDeleteComment} modalId="updateModal" />
        )}
      </div>
      <p className="mt-3">{comment.description}</p>
      <div className="mt-3 gap-1 flex place-items-center">
        <h1 className="">{totalLikes}</h1>
        <HeartIcon
          onClick={handleLike}
          className={`cursor-pointer h-7 w-7 ${isLiked && "fill-red-500"}`}
        />
      </div>
    </div>
  );
};

export default CommentCard;
