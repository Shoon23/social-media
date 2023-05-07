import { iPost } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  modalId: string;
  post: iPost;
  setPost: React.Dispatch<any>;
}

const UpdatePostModal: React.FC<Props> = ({ modalId, post, setPost }) => {
  useEffect(() => {
    setPreviewImage(post.image);
    setDescription(post.description);
  }, []);

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const hiddenImageInput = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
  const session = useSession();

  const closeRef = useRef<HTMLLabelElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    hiddenImageInput?.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImage(null);
    setPreviewImage("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/post/update", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.postId,
          userId: post.userId,
          description,
        }),
      });

      if (res.ok) {
        setPost((prev: any) => ({ ...prev, description }));
        closeRef.current?.click();
      }
    } catch (error) {
      console.log(error);
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

          <h3 className="text-lg font-bold">Update Post</h3>
          <form
            onSubmit={handleUpdate}
            action=""
            className="py-4 flex flex-col gap-3"
          >
            <textarea
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
              className="textarea textarea-secondary resize-none w-full"
              placeholder="Write a post"
            ></textarea>
            {previewImage && <img src={previewImage} alt="Preview" />}
            <input
              ref={hiddenImageInput}
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage ? (
              <button
                disabled={true}
                onClick={handleRemoveImage}
                className="rounded-md btn btn-error self-end"
              >
                Remove Photo
              </button>
            ) : (
              <button
                disabled={true}
                onClick={handleAddImage}
                className="rounded-md btn btn-success self-end"
              >
                Add Photo
              </button>
            )}
            <button
              disabled={
                (description === post.description &&
                  previewImage === post.image) ||
                (!description && !previewImage)
              }
              className="rounded-md btn btn-primary"
              type="submit"
            >
              Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePostModal;
