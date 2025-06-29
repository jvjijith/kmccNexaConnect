'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Clear, Save, Undo } from '@mui/icons-material';

interface SignatureCanvasProps {
  onSignatureSave: (signatureUrl: string) => void;
  onSignatureClear?: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export default function SignatureCanvas({
  onSignatureSave,
  onSignatureClear,
  width = 400,
  height = 200,
  disabled = false
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setError(null);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setError(null);
    
    if (onSignatureClear) {
      onSignatureClear();
    }
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert signature to blob'));
          }
        }, 'image/png', 0.8);
      });

      // Create file from blob
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      
      // For now, create a data URL for preview
      // In a real implementation, you would upload this using the upload utility
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureSave(dataUrl);

    } catch (err) {
      console.error('Error saving signature:', err);
      setError('Failed to save signature. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Digital Signature
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please sign in the box below using your mouse or touch screen
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 1,
          display: 'inline-block',
          border: '2px dashed #ccc',
          borderRadius: 2
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            cursor: disabled ? 'not-allowed' : 'crosshair',
            display: 'block',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={clearSignature}
          disabled={!hasSignature || disabled || isUploading}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          startIcon={isUploading ? <CircularProgress size={16} /> : <Save />}
          onClick={saveSignature}
          disabled={!hasSignature || disabled || isUploading}
        >
          {isUploading ? 'Saving...' : 'Save Signature'}
        </Button>
      </Box>
    </Box>
  );
}