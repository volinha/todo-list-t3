import type { Todo } from "~/types";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

type TodoProps = {
  todo: Todo;
}

export default function Todo({ todo }: TodoProps ) {
  const {id, text, done} = todo;
  const trpc = api.useContext();

  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onMutate: async ({ id, done }) => {
      // cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      // create a snapshot of previous values
      const previousTodos = trpc.todo.all.getData();

      // optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) previousTodos;
        return prev?.map(todo => {
          if (todo.id === id) { // if the todo id matches the id of the todo we are updating
            return {            // then return the todo with the updated done value
              ...todo,
              done: done
            }
          }
          return todo;  // else return the todo as is
        }); // remove the todo from the list of todos
      })

      // Return a context object with the snapshotted data so we can rollback if the request fails
      return { previousTodos };
    },
    // create an onSucess method to return a toast when  the request is successful
    onSuccess: (err, {done}) => {
      if(done) {
        toast.success(`Todo '${text}' is done! ٩(◕‿◕)و✧`);
      }
    },
    onError: (err, newTodo, context) => {
        toast.error(`Something went wrong when updating the todo to ${done ? 'done' : 'not done'}.`);
        trpc.todo.all.setData(undefined, () => context?.previousTodos) // rollback to previous values
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    }
  })

  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onMutate: async (deleteId) => {
      
      await trpc.todo.all.cancel(); //

      // create a snapshot of previous values
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => { // optimistically update to the new value
        if (!prev) previousTodos;
        return prev?.filter(todos => todos.id !== deleteId); // remove the todo from the list of todos
      })

      return { previousTodos }; // Return a context object with the snapshotted data so we can rollback if the request fails
    },
    onError: (err, newTodo, context) => {
        toast.error("Something went wrong when deleting the todo.");
        trpc.todo.all.setData(undefined, () => context?.previousTodos) // rollback to previous values
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate(); // refetch the list of todos
    }
  })

  return (
    <>
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        <input className=" w-4 h-4 cursor-pointer border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" 
        type="checkbox" 
        name="done"
        id={id}
        checked={done}
        onChange={(e) => {
          doneMutation({ id, done: e.target.checked });
        }}
        />
        <label htmlFor={id} className={`${done ? 'line-through text-white/50' : ""} cursor-pointer`}>
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
