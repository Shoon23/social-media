import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import uploadImage from "@/lib/cloudinary/uploadImage";
import { iMySession } from "@/types";

const NewPostModal = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const hiddenImageInput = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const session = useSession();
  const [isPost, setIsPost] = useState(false);
  const closeRef = useRef<HTMLLabelElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!description && !image) {
      return setError("At Least One Field is required");
    }
    setIsPost(true);
    const userId = (session?.data?.user as iMySession)?.id ?? null;
    let cloudinaryData;
    try {
      if (image) {
        cloudinaryData = await uploadImage(image);
      }

      const res = await fetch("/api/user/post/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId,
          description,
          imageUrl: cloudinaryData?.secure_url ?? null,
        }),
      });
      closeRef.current?.click();
      setIsPost(false);
      setImage(null);
      setPreviewImage("");
      setDescription("");
      setError("");
    } catch (error) {
      setError("Something Went Wrong Please try again later");
      setTimeout(() => {
        closeRef.current?.click();
      }, 3000);
    }
  };

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label
            ref={closeRef}
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <h3 className="text-lg font-bold">Add New Post</h3>
          <form
            onSubmit={handleSubmit}
            action=""
            className="py-4 flex flex-col gap-3"
          >
            {error && <h1 className="text-red-500">{error}</h1>}
            <textarea
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
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
                onClick={handleRemoveImage}
                className="rounded-md btn btn-error self-end"
              >
                Remove Photo
              </button>
            ) : (
              <button
                onClick={handleAddImage}
                className="rounded-md btn btn-success self-end"
              >
                Add Photo
              </button>
            )}

            <button
              disabled={isPost}
              className="rounded-md btn btn-primary"
              type="submit"
            >
              Add Post
            </button>
          </form>
        </label>
      </label>
    </>
  );
};

export default NewPostModal;
