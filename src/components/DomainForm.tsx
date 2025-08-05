import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useToast } from "@/hooks/use-toast";
import { useGitHub } from "@/hooks/use-github";
import { Loader2, Check, AlertCircle, AlertTriangle } from "lucide-react";


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        hero: "bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
);


const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
    {...props}
  />
);

// Card components
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const DomainForm = () => {
  const [domain, setDomain] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { 
    isLoading, 
    error, 
    addDomain, 
    checkDomain, 
    validateToken, 
    clearError 
  } = useGitHub();

  const validateDomain = (value: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.nad$/;
    return domainRegex.test(value);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    
    if (value) {
      setIsValid(validateDomain(value));
    } else {
      setIsValid(null);
    }
  };


  useEffect(() => {
    const validateGitHubToken = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        toast({
          title: "GitHub Configuration Error",
          description: "Please check your GitHub token configuration.",
          variant: "destructive",
        });
      }
    };
    
    validateGitHubToken();
  }, [validateToken, toast]);

  
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [domain, error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || !isValid) {
      toast({
        title: "Invalid domain",
        description: "Please enter a valid .nad domain",
        variant: "destructive",
      });
      return;
    }

    // Check if domain already exists
    const domainExists = await checkDomain(domain);
    if (domainExists) {
      toast({
        title: "Domain already registered",
        description: `${domain} is already registered in the system.`,
        variant: "destructive",
      });
      return;
    }

    // Add domain to GitHub
    const success = await addDomain(domain);
    
    if (success) {
      toast({
        title: "Domain registered successfully!",
        description: `${domain} has been registered and saved to GitHub.`,
      });
      
      setDomain("");
      setIsValid(null);
    } else {
      toast({
        title: "Registration failed",
        description: error || "There was an error registering your domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-lg border-border/50 shadow-glow">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium text-foreground">
              Enter your domain
            </label>
            <div className="relative">
              <Input
                id="domain"
                type="text"
                placeholder="yourname.nad"
                value={domain}
                onChange={handleDomainChange}
                className="pr-10 bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
                disabled={isLoading}
              />
              {domain && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValid === true && (
                    <Check className="h-4 w-4 text-primary animate-glow" />
                  )}
                  {isValid === false && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {domain && !isValid && (
              <p className="text-xs text-destructive">
                Domain must end with .nad and contain valid characters
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Domain"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};