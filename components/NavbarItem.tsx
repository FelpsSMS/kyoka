import { useRouter } from "next/router";

export default function NavbarItem({ title, link }) {
  const router = useRouter();

  return (
    <button
      className="text-white cursor-pointer focus:border-b-2 focus:font-black hover:border-b-2 hover:font-black p-4 h-14 focus:outline-none"
      onClick={() => {
        router.push(link);
      }}
    >
      {title}
    </button>
  );
}
