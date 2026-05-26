import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export function App() {
  const { data, isPending, error } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const { data, error } = await api.hello.get();
      if (error) throw error;
      return data;
    },
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <h1>{data?.message}</h1>;
}
