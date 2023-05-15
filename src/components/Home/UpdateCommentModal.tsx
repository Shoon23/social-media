import { prisma } from "@/lib/prisma";
import { iComment } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  comment: iComment;
  modalId: string;
  setComments: React.Dispatch<React.SetStateAction<iComment[]>>;
}

const UpdateCommentModal = ({ comment, modalId, setComments }: Props) => {
  useEffect(() => {
    setNewDescription(comment.description);
    if (updateBtnRef.current) {
      updateBtnRef.current.disabled = true;
    }
  }, []);

  const [newDescription, setNewDescription] = useState("");

  const updateBtnRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLLabelElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewDescription(e.target.value);
  };

  const handleUpdateCommnet = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/user/post/comment/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: comment.userId,
        commentId: comment.commentId,
        description: newDescription,
      }),
    });
    if (res.ok) {
      const data = await res.json();

      console.log(data);
      setComments((comments) =>
        comments.map((comment) =>
          comment.commentId === data.commentId
            ? { ...comment, description: data?.description }
            : comment
        )
      );
      closeRef.current?.click();
    }
    if (res.status == 500) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            ref={closeRef}
            htmlFor={modalId}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-2">Update Comment</h3>
          <form action="" onSubmit={handleUpdateCommnet}>
            <label htmlFor="" className="">
              Desciption
            </label>
            <textarea
              value={newDescription}
              onChange={handleOnChange}
              className="mt-2 textarea resize-none w-full textarea-bordered"
              placeholder="Comment here"
            ></textarea>
            <button
              disabled={
                newDescription === comment.description || !newDescription
              }
              ref={updateBtnRef}
              className="btn btn-active w-full btn-primary"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateCommentModal;
