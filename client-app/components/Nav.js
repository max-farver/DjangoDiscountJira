import Link from "next/link";
const Nav = () => {
  return (
    <nav className="bg-blue-700 p-4 md:px-10 flex justify-between items-center">
      <Link href="/">
        <a>
          <h1 className="text-2xl font-bold text-white tracking-wide uppercase">
            Discount Jira
          </h1>
        </a>
      </Link>
      <Link href="/">
        <a>
          <button className="px-4 py-2 font-bold tracking-wide bg-white text-blue-900 rounded-md hover:shadow-md">
            Login
          </button>
        </a>
      </Link>
    </nav>
  );
};

export default Nav;
