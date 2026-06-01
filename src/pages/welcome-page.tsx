import { useState } from "react";
import { ArrowRight, Leaf, Users, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface RoleOption {
  value: Role;
  label: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "procurement",
    label: "Procurement Manager",
    description:
      "Monitor supplier risk exposure across your supply chain and trigger remediation workflows.",
    icon: BarChart3,
    badge: "Internal",
  },
  {
    value: "esg-analyst",
    label: "ESG / Compliance Analyst",
    description:
      "Assess evidence quality, apply policy rules, and maintain audit-ready compliance records.",
    icon: Shield,
    badge: "Internal",
  },
  {
    value: "supplier",
    label: "Supplier User",
    description:
      "Submit evidence, respond to remediation requests, and track your compliance status.",
    icon: Users,
    badge: "External",
  },
];

interface WelcomePageProps {
  onEnter: (role: Role) => void;
}

export function WelcomePage({ onEnter }: WelcomePageProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("procurement");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            SustainOps
          </span>
        </div>
        <Badge variant="outline" className="ml-3 text-xs">
          Demo Workspace
        </Badge>
      </div>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl space-y-12">
          {/* Header copy */}
          <div className="space-y-4 text-center">
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground px-3 py-1"
            >
              Supplier Sustainability Risk & Compliance Workspace
            </Badge>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance text-foreground">
              Identify ESG risk.<br />
              Close evidence gaps.<br />
              Drive auditable remediation.
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground text-balance">
              SustainOps gives procurement, ESG, and compliance teams a single
              workspace to understand supplier sustainability risk, manage
              evidence, and run verifiable remediation workflows.
            </p>
          </div>

          {/* Role selector */}
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Select your role to explore the demo workspace
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {roleOptions.map((option) => (
                <Card
                  key={option.value}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === option.value
                      ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                  onClick={() => setSelectedRole(option.value)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <option.icon className="size-4 text-foreground" />
                      </div>
                      <Badge
                        variant={
                          option.badge === "External" ? "outline" : "secondary"
                        }
                        className="text-xs"
                      >
                        {option.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              className="gap-2 px-8"
              onClick={() => onEnter(selectedRole)}
            >
              Explore demo workspace
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              This workspace uses realistic sample supplier data. No real
              suppliers, credentials, or sensitive information are included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
