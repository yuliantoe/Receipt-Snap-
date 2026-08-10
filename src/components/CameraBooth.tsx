import React, { useState, useEffect, useRef } from 'react';
import { LayoutMode, StoreSettings } from '../types';
import { Camera, RefreshCw, Zap, Sparkles, ArrowRight, RotateCcw, Clock, Grid2X2, Layers, HeartHandshake } from 'lucide-react';
import { playShutterSound, playCountdownBeep } from '../utils/audio';

interface CameraBoothProps {
  settings: StoreSettings;
  onPhotosCaptured: (photos: string[], layout: LayoutMode) => void;
}

export const CameraBooth: React.FC<CameraBoothProps> = ({ settings, onPhotosCaptured }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('strip_3');
  const [timerSec, setTimerSec] = useState<number>(3);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);

  const requiredCount =
    layoutMode === 'strip_1'
      ? 1
      : layoutMode === 'strip_2'
      ? 2
      : layoutMode === 'grid_2x2'
      ? 4
      : layoutMode === 'strip_4'
      ? 4
      : 3;

  // Initialize WebRTC Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCamera(true);
      } catch (err) {
        console.warn('Camera access error or restricted:', err);
        setHasCamera(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Capture a single photo frame from video stream or canvas fallback
  const captureFrame = (): string => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    if (hasCamera && videoRef.current) {
      // Draw camera frame (mirror if front camera)
      ctx.save();
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      // Simulated High Quality Photobooth Frame for container / demo preview
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#27272a');
      grad.addColorStop(1, '#09090b');
      ctx.fillStyle = grad;
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Aesthetic Y2K graphic frame
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Avatar/Pose silhouette
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 40, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 + 200, 200, 0, Math.PI * 2);
      ctx.fill();

      // Timestamp & Watermark overlay
      ctx.fillStyle = '#fdfbf7';
      ctx.font = 'bold 32px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`★ SNAP #${capturedPhotos.length + 1} ★`, canvas.width / 2, 90);

      ctx.font = '24px "Courier New", monospace';
      ctx.fillText(settings.storeName, canvas.width / 2, canvas.height - 70);
      ctx.font = '18px "Courier New", monospace';
      ctx.fillText('GEN-Z RECEIPT PHOTOBOOTH', canvas.width / 2, canvas.height - 40);
    }

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  // Start sequence capture
  const startCaptureSequence = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCapturedPhotos([]);
    setCurrentPhotoIdx(0);

    const photos: string[] = [];

    for (let i = 0; i < requiredCount; i++) {
      setCurrentPhotoIdx(i + 1);

      // Countdown timer
      for (let c = timerSec; c > 0; c--) {
        setCountdown(c);
        if (settings.soundEnabled) playCountdownBeep(false);
        await new Promise((res) => setTimeout(res, 1000));
      }

      setCountdown(0);
      if (settings.soundEnabled) {
        playCountdownBeep(true);
        playShutterSound();
      }

      // Flash effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 200);

      // Capture photo frame
      const frame = captureFrame();
      photos.push(frame);
      setCapturedPhotos([...photos]);

      // Pause before next frame if multiple
      if (i < requiredCount - 1) {
        await new Promise((res) => setTimeout(res, 1200));
      }
    }

    setCountdown(null);
    setIsCapturing(false);

    // Auto navigate to Editor on complete
    setTimeout(() => {
      onPhotosCaptured(photos, layoutMode);
    }, 800);
  };

  const handleReset = () => {
    setCapturedPhotos([]);
    setIsCapturing(false);
    setCountdown(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Kiosk Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-neutral-900 border-2 border-neutral-800 p-4 rounded-2xl shadow-lg">
        <div>
          <span className="inline-block bg-amber-400 text-neutral-950 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full mb-1">
            TABLET KIOSK BOOTH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
            RECEIPT SNAP STUDIO
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            Pilih Layout & Timer, lalu tekan tombol foto untuk mencetak struk!
          </p>
        </div>

        {/* Layout & Timer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Picker */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex flex-wrap items-center gap-1">
            <button
              disabled={isCapturing}
              onClick={() => setLayoutMode('strip_1')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                layoutMode === 'strip_1'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1 Strip</span>
            </button>
            <button
              disabled={isCapturing}
              onClick={() => setLayoutMode('strip_2')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                layoutMode === 'strip_2'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2 Strip</span>
            </button>
            <button
              disabled={isCapturing}
              onClick={() => setLayoutMode('strip_3')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                layoutMode === 'strip_3'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3 Strip</span>
            </button>
            <button
              disabled={isCapturing}
              onClick={() => setLayoutMode('strip_4')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                layoutMode === 'strip_4'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4 Strip</span>
            </button>
            <button
              disabled={isCapturing}
              onClick={() => setLayoutMode('grid_2x2')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                layoutMode === 'grid_2x2'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>2x2 Grid</span>
            </button>
          </div>

          {/* Timer Picker */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
            {[3, 5, 10].map((s) => (
              <button
                key={s}
                disabled={isCapturing}
                onClick={() => setTimerSec(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                  timerSec === s
                    ? 'bg-white text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{s}s</span>
              </button>
            ))}
          </div>

          {/* Camera Flip Button */}
          {hasCamera && (
            <button
              onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition"
              title="Flip Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tablet Layout: Live Camera Feed + Thumbnail Reel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera Display */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] bg-neutral-950 border-4 border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Flash Effect */}
            {flashActive && (
              <div className="absolute inset-0 bg-white z-30 animate-ping opacity-90"></div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <span className="text-8xl sm:text-9xl font-black font-mono text-amber-400 animate-bounce drop-shadow-[0_10px_20px_rgba(251,191,36,0.5)]">
                  {countdown}
                </span>
                <span className="mt-4 font-mono font-bold text-sm bg-neutral-900 border border-amber-400/50 text-amber-300 px-4 py-1.5 rounded-full">
                  POSE #{currentPhotoIdx} OF {requiredCount} 📸
                </span>
              </div>
            )}

            {/* WebRTC Video Stream */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`w-full h-full object-cover ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              } ${!hasCamera ? 'hidden' : ''}`}
            />

            {/* Canvas Fallback if Camera Permission Pending/Blocked */}
            {!hasCamera && (
              <div className="relative w-full h-full bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <canvas ref={canvasRef} className="hidden" />
                <div className="w-20 h-20 rounded-full bg-amber-400/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-4 animate-pulse">
                  <Camera className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-mono text-white mb-2">
                  KAMERA SIMULATOR READY
                </h3>
                <p className="text-xs text-neutral-400 font-mono max-w-sm mb-4">
                  (Menggunakan kamera virtual photobooth untuk mode preview tablet)
                </p>
                <button
                  onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl text-xs font-mono font-bold text-amber-300 transition"
                >
                  ⚡ Muat Ulang Kamera Fisik Tablet
                </button>
              </div>
            )}

            {/* Receipt Overlay Guide Frames */}
            <div className="absolute inset-0 border-[12px] border-black/30 pointer-events-none flex flex-col justify-between p-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 bg-black/60 px-3 py-1 rounded-full w-fit">
                <span>REC ● 60FPS</span>
                <span className="ml-3 text-neutral-300">LAYOUT: {layoutMode.toUpperCase()}</span>
              </div>
              <div className="text-center font-mono text-xs text-neutral-400 bg-black/50 py-1 px-4 rounded-full self-center">
                {isCapturing ? `MENGAMBIL FOTO ${currentPhotoIdx}/${requiredCount}` : 'SIAP AMBIL FOTO'}
              </div>
            </div>
          </div>

          {/* Big Tablet Capture Button */}
          <div className="w-full mt-5 flex items-center justify-center gap-4">
            {!isCapturing ? (
              <button
                onClick={startCaptureSequence}
                className="w-full max-w-md py-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-mono font-black text-xl rounded-2xl shadow-[0_8px_0px_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-3"
              >
                <Camera className="w-7 h-7 stroke-[2.5]" />
                <span>AMBIL FOTO ({requiredCount} SHOTS)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full max-w-md py-4 bg-neutral-800 text-amber-400 font-mono font-black text-xl rounded-2xl border-2 border-amber-400/40 flex items-center justify-center gap-3 animate-pulse"
              >
                <Zap className="w-6 h-6 animate-spin" />
                <span>MENGAMBIL FOTO...</span>
              </button>
            )}

            {capturedPhotos.length > 0 && !isCapturing && (
              <button
                onClick={handleReset}
                className="p-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-2 border-neutral-700 rounded-2xl transition"
                title="Reset Photos"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Photo Reel & Receipt Preview Strip */}
        <div className="lg:col-span-4 bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-mono font-bold text-sm text-neutral-200">
                  HASIL JEPRETAN ({capturedPhotos.length}/{requiredCount})
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-neutral-800 text-amber-400 px-2 py-0.5 rounded">
                STRUK PREVIEW
              </span>
            </div>

            {/* Captured Thumbnails List */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Array.from({ length: requiredCount }).map((_, idx) => {
                const photoUrl = capturedPhotos[idx];
                return (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] bg-neutral-950 border-2 border-neutral-800 rounded-xl overflow-hidden flex items-center justify-center group"
                  >
                    {photoUrl ? (
                      <>
                        <img
                          src={photoUrl}
                          alt={`Shot ${idx + 1}`}
                          className="w-full h-full object-cover transition group-hover:scale-105"
                        />
                        <span className="absolute top-1 left-1 bg-black/80 text-amber-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-600 font-mono text-xs">
                        <Camera className="w-5 h-5 mb-1 opacity-40" />
                        <span>FOTO {idx + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div>
            {capturedPhotos.length === requiredCount ? (
              <button
                onClick={() => onPhotosCaptured(capturedPhotos, layoutMode)}
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-mono font-bold text-base rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition flex items-center justify-center gap-2"
              >
                <span>DESAIN STRUK KASIR</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-center font-mono text-xs text-neutral-400">
                Tekan tombol <span className="text-amber-400 font-bold">"AMBIL FOTO"</span> untuk memulai sesi jepret
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
