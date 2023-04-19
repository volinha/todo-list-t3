import { useState } from "react";
import { api } from "../utils/api";
import { todoInput } from "~/types";
import { toast } from "react-hot-toast";

export default function CreateTodo() {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.todo.create.useMutation({
    onMutate: async (newTodo) => {
      // cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      // create a snapshot of previous values
      const previousTodos = trpc.todo.all.getData();

      // optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        const optimisticTodo = {
          id: "optimistic-todo-id",
          text: newTodo,
          done: false,
        };
        if (!prev) return [optimisticTodo]; // prev is undefined
        return [...prev, optimisticTodo]; // add the optimistic todo to the array
      });

      setNewTodo("");

      // Return a context object with the snapshotted data so we can rollback if the request fails
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
        toast.error("Something went wrong");
        setNewTodo(newTodo);    
        trpc.todo.all.setData(undefined, () => context?.previousTodos) // rollback to previous values
    
    },
    onSettled: async () => {
      // when the create is settled, invalidate the todo.all and forces it to refetch
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const result = todoInput.safeParse(newTodo);

          if (!result.success) {
            console.log("Invalid!");
            toast.error(result.error.format()._errors.join("\n"));
            return;
          }

          // create todo mutation
          mutate(newTodo);
        }}
      >
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="New todo..."
          name="new-todo"
          id="new-todo"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </button>
      </form>
    </div>
  );
}
