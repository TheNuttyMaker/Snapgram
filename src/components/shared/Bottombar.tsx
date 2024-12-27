import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({
  isActive,
  link,
}: {
  isActive: boolean;
  link: INavLink;
}) => {
  return (
    <Link
      to={link.route}
      key={link.label}
      className={`flex-center flex-col gap-1 p-2 bottombar-link transition ${
        isActive && "bg-primary-500 rounded-[10px]"
      }`}
    >
      <img
        src={link.imgURL}
        alt={link.label}
        width={16}
        height={16}
        className={`${isActive && "invert-white"}`}
      />
      <p className="tiny-medium text-light-2">{link.label}</p>
    </Link>
  );
};

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = link.route === pathname;

        return <SidebarLink isActive={isActive} link={link} />;
      })}
    </section>
  );
};

export default Bottombar;
