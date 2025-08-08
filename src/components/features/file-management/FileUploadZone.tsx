"use client"

import * as React from "react";
import { Upload } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect?: (files: FileList) => void;
  className?: string;
}

export function FileUploadZone({ onFileSelect, className }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <Card className={cn("border-2 border-dashed transition-colors duration-200 hover:border-primary/50", className)}>
      <CardContent 
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center transition-colors duration-200",
          isDragOver && "bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload PDF Files</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your PDF files here, or click to browse
        </p>
        <div className="relative">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}