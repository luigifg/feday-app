import ButtonSvg from "../assets/svg/ButtonSvg";
import { ExternalLink } from "lucide-react";

const Button = ({ className, href, onClick, children, px, white, withIcon }) => {
  const classes = `button relative inline-flex 
    items-center justify-center h-11 transition-colors 
    hover:text-color-4 ${px || "px-7"} ${white ? "text-n-1" : "text-n-8"} ${
    className || ""
  }`;

  const wrappedChildren = (
    <div className="flex items-center gap-2">
      {children}
      {withIcon && <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />}
    </div>
  );

  const spanClasses = "relative z-10";

  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={spanClasses}>{wrappedChildren}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{wrappedChildren}</span>
      {ButtonSvg(white)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;