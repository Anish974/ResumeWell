import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Download, Trash2, Calendar, Edit2, File } from "lucide-react";
import { format } from "date-fns";

interface Resume {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface ResumeListProps {
  userId: string;
}

const ResumeList = ({ userId }: ResumeListProps) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const fetchResumes = async () => {
    try {
      console.log("Fetching resumes for user:", userId);
      
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("uploaded_at", { ascending: false });

      console.log("Fetch resumes response:", { data, error });

      if (error) {
        console.error("Fetch resumes error:", error);
        throw error;
      }
      
      setResumes(data || []);
    } catch (error: any) {
      console.error("Failed to load resumes:", error);
      toast.error(`Failed to load resumes: ${error.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();

    const handleResumeUploaded = () => {
      fetchResumes();
    };

    window.addEventListener("resume-uploaded", handleResumeUploaded);
    return () => {
      window.removeEventListener("resume-uploaded", handleResumeUploaded);
    };
  }, [userId]);

  const handleDownload = async (resume: Resume) => {
    try {
      console.log("Downloading resume:", resume.file_path);
      
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(resume.file_path);

      console.log("Download response:", { data, error });

      if (error) {
        console.error("Download error:", error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Resume downloaded");
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error(`Failed to download: ${error.message || "Network error"}`);
    }
  };

  const handleRename = async (resume: Resume) => {
    if (!editedName.trim() || editedName === resume.file_name) {
      setEditingId(null);
      setEditedName("");
      return;
    }

    try {
      const { error } = await supabase
        .from("resumes")
        .update({ file_name: editedName })
        .eq("id", resume.id);

      if (error) throw error;

      setResumes(resumes.map(r => 
        r.id === resume.id ? { ...r, file_name: editedName } : r
      ));
      setEditingId(null);
      setEditedName("");
      toast.success("Resume renamed successfully");
    } catch (error: any) {
      console.error("Rename failed:", error);
      toast.error("Failed to rename resume");
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (!confirm(`Are you sure you want to delete "${resume.file_name}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([resume.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (dbError) throw dbError;

      setResumes(resumes.filter((r) => r.id !== resume.id));
      toast.success("Resume deleted");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete resume");
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Your Resumes</CardTitle>
        <CardDescription>
          {resumes.length === 0
            ? "No resumes uploaded yet"
            : `${resumes.length} resume${resumes.length === 1 ? "" : "s"} stored securely`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Upload your first resume to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-full h-14 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-3 px-4 border-b border-border text-muted-foreground">
                  <div className="text-2xl">
                    {resume.mime_type === 'application/pdf' ? '📑' : 
                     resume.mime_type.startsWith('image/') ? '🖼️' : 
                     resume.mime_type.includes('word') ? '📝' : '📄'}
                  </div>
                  <span className="text-sm font-medium truncate">{resume.file_name}</span>
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-3">
                  {/* File Name with Edit */}
                  <div className="flex items-center gap-2">
                    {editingId === resume.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={() => handleRename(resume)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(resume);
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditedName("");
                          }
                        }}
                        className="flex-1 px-3 py-2 text-sm font-semibold border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="flex-1 font-semibold text-sm truncate" title={resume.file_name}>
                          {resume.file_name}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(resume.id);
                            setEditedName(resume.file_name);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <File className="w-3 h-3" />
                      {(resume.file_size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(resume.uploaded_at), "MMM d, yyyy")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(resume)}
                      className="flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(resume)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeList;


