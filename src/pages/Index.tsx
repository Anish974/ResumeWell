import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileCheck, Database, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ResumeWell
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Your Resumes, Safely Stored
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A private, encrypted vault for storing and managing your clients' resumes. 
              Enterprise-grade security meets simple design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">End-to-End Encrypted</h3>
              <p className="text-muted-foreground text-sm">
                Your resumes are encrypted at rest and in transit. Complete privacy guaranteed.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
                <FileCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure File Management</h3>
              <p className="text-muted-foreground text-sm">
                Upload, download, and manage resumes with ease. PDF and Word formats supported.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Client-Specific Access</h3>
              <p className="text-muted-foreground text-sm">
                Each client has their own secure account. No data sharing, complete isolation.
              </p>
            </div>
          </div>

          <div className="mt-20 p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to secure your resumes?</h3>
              <p className="text-muted-foreground mb-6">
                Join hundreds of professionals who trust ResumeWell for their document storage needs.
              </p>
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-border/50">
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            <span>Built with security and privacy at its core</span>
          </div>
          <p>&copy; 2025 ResumeWell. All rights reserved.</p>
          <p className="mt-4 text-sm">
            Made by <span className="font-semibold text-primary">Anish</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
