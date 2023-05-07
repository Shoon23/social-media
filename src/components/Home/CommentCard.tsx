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

interface Props {
  comment: iComment;
  setComments: React.Dispatch<React.SetStateAction<iComment[]>>;
}

const CommentCard: React.FC<Props> = ({ comment, setComments }) => {
  useEffect(() => {
    setIsLiked(comment.isLiked);
    setTotalLikes(comment.totalLikes);
  }, []);

  const session = useSession();
  const user = session.data?.user as iMySession;
  const [isLiked, setIsLiked] = useState<boolean>();
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const handleLike = async () => {
    try {
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

      if (res.ok) {
        if (isLiked) {
          setIsLiked(false);
          setTotalLikes((prev) => prev - 1);
        } else {
          setIsLiked(true);
          setTotalLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`/api/user/post/comment/${comment.commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) =>
          prev.filter((item) => item.commentId !== comment.commentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
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
