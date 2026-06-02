import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <Card className="max-w-md w-full border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="size-5" />
                Something went wrong
              </CardTitle>
              <CardDescription className="text-xs">
                An unexpected error occurred. Your data has not been affected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error?.message && (
                <div className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={this.handleReset}
                >
                  <RotateCcw className="size-3" />
                  Try again
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
