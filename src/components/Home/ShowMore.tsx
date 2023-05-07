import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import React from "react";

interface Props {
  handleDelete: () => Promise<void>;
  modalId: string;
}

const ShowMore: React.FC<Props> = ({ handleDelete, modalId }) => {
  return (
    <div className="dropdown dropdown-start">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <EllipsisHorizontalIcon className="w-7 h-7 cursor-pointer" />
      </label>
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <label htmlFor={modalId}>Update</label>
        </li>
        <li onClick={handleDelete}>
          <a className="text-red-500">Delete</a>
        </li>
      </ul>
    </div>
  );
};

export default ShowMore;
