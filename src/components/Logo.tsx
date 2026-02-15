import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ showTagline = true }: { showTagline?: boolean }) => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="gradient-primary p-2 rounded-xl">
      <Activity className="w-6 h-6 text-primary-foreground" />
    </div>
    <div>
      <span className="text-xl font-bold font-display text-foreground tracking-tight">
        Prognosis
      </span>
      {showTagline && (
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium -mt-0.5">
          Predict. Prevent. Protect.
        </p>
      )}
    </div>
  </Link>
);

export default Logo;
