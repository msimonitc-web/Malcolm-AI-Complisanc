import React, { useEffect, useState } from 'react';
import { useAcademy } from '../context/AcademyContext';

interface WatermarkOverlayProps {
  className?: string;
  isAbsolute?: boolean; // absolute inside containers, fixed for pages/PDF viewports
  opacity?: number;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  className = '',
  isAbsolute = true,
  opacity = 0.06
}) => {
  const { student } = useAcademy();
  const [watermarkUrl, setWatermarkUrl] = useState<string>('');
  const [loadTime] = useState<string>(() => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  });

  useEffect(() => {
    const studentEmail = student.email || 'malcolm@complisanc.com';
    const watermarkText = `${studentEmail} • COMPLISEY AUDIT • ${loadTime}`;
    
    // Create offscreen canvas for dynamic watermark tiles
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on estimated text length
    canvas.width = 450;
    canvas.height = 300;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style text
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = `rgba(100, 116, 139, ${opacity})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Move center to support rotation around original axis
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((-22 * Math.PI) / 180); // Diagonal tilt

    // Draw text
    ctx.fillText(watermarkText, 0, 0);

    // Save as repeat data URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setWatermarkUrl(dataUrl);
    } catch (e) {
      console.error('Error generating watermark canvas data:', e);
    }
  }, [student.email, loadTime, opacity]);

  if (!watermarkUrl) return null;

  return (
    <div
      id="compliance-security-watermark"
      className={`${
        isAbsolute ? 'absolute' : 'fixed'
      } inset-0 pointer-events-none select-none z-40 ${className}`}
      style={{
        backgroundImage: `url(${watermarkUrl})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0',
      }}
      aria-hidden="true"
    />
  );
};
