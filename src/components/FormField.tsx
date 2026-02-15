import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options?: { value: string; label: string }[];
}

const FormField = ({ label, name, type = "text", placeholder, required, value = "", onChange, options }: FormFieldProps) => {
  if (options) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="rounded-xl bg-background/50 border-border/60 focus:ring-primary/30">
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Textarea
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="rounded-xl bg-background/50 border-border/60 focus:ring-primary/30 min-h-[80px]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-xl bg-background/50 border-border/60 focus:ring-primary/30"
      />
    </div>
  );
};

export default FormField;
