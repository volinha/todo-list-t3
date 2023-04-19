import type { Todo } from "~/types";
import { api } from "../utils/api";

type TodoProps = {
  todo: Todo;
}

export default function Todo({ todo }: TodoProps ) {
  const {id, text, done} = todo;
  const trpc = api.useContext();

  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    }
  })

  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    }
  })

  return (
    <>
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        <input className=" w-4 h-4 cursor-pointer border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" 
        type="checkbox" 
        name="done"
        id="done"
        checked={done}
        onChange={(e) => {
          doneMutation({ id, done: e.target.checked });
        }}
        />
        <label htmlFor="done" className={`${done ? 'line-through text-white/50' : ""} cursor-pointer`}>
          { text }
        </label>
      </div>
      <button 
        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        onClick={() => {
          deleteMutation(id);
        }}
      >Delete</button>
    </div>
    </>
  );
}
