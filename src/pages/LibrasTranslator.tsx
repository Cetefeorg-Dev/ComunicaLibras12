import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Video, Square, RefreshCcw, HandMetal, Share2, Copy, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function LibrasTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    async function setupCamera() {
      if (videoFile) return; // Se tem vídeo selecionado, não pede câmera
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setCameraError(true);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoFile]);

  const processVideoTranslation = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    setIsProcessing(true);
    setTranslatedText("");
    
    // Animações de status simulando steps reais para o usuário
    setLoadingText("Extraindo frames do vídeo...");
    
    try {
      // Pega 4 frames do vídeo atual
      const frames: string[] = [];
      const canvas = document.createElement("canvas");
      // Resolução segura e leve
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Failed to get canvas target");

      // Captura o momento exato atual + alguns extras 
      // Se for galeria, a gente tentaria pular, mas por simplicidade pegamos sequencial com pequeno delay
      for (let i = 0; i < 4; i++) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.5));
        await new Promise(r => setTimeout(r, 400)); // Espera quase meio segundo entre frames p/ pegar ação
      }
      
      setLoadingText("Enviando vídeo para a IA...");
      
      const response = await fetch("/api/ai/translate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames }),
      });

      setLoadingText("Processando tradução de Libras...");

      if (!response.ok) {
        throw new Error("Falha ao comunicar com a IA");
      }

      const data = await response.json();
      setTranslatedText(data.result || "Nenhum sinal detectado.");
      
    } catch (err) {
      console.error(err);
      setTranslatedText("Não foi possível realizar a tradução. A IA pode estar offline ou não detectou os gestos.");
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      processVideoTranslation();
    } else {
      setIsRecording(true);
      setTranslatedText("");
      setLoadingText("Gravando sinais...");
      // Auto-processa após 3 segundos
      setTimeout(() => {
         processVideoTranslation();
      }, 3000);
    }
  };

  const copyToClipboard = () => {
    if (translatedText) navigator.clipboard.writeText(translatedText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Limpa os estados de erro/gravação
      setCameraError(false);
      setIsRecording(false);
      setIsProcessing(false);
      setTranslatedText("");

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setTranslatedText("");
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="flex items-center px-4 py-4 glass-header shrink-0 absolute top-0 left-0 right-0 z-20 border-b-0">
        <Link to="/" className="p-2 -ml-2 text-white/70 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="ml-2 font-bold text-white tracking-wide uppercase text-sm">Tradutor Libras</span>
        <span className="ml-auto bg-gradient-to-r from-cyan-400 to-blue-400 text-[#0f172a] text-[10px] font-bold px-2 py-1 rounded-md uppercase">IA</span>
      </header>

      <div className="flex-1 relative flex items-center justify-center bg-black/40 overflow-hidden">
        {cameraError && !videoFile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#0f172a]">
            <Camera className="w-16 h-16 text-white/20 mb-4" />
            <p className="text-white/70 font-medium max-w-[250px]">
              Não foi possível acessar a câmera do seu dispositivo. 
              Verifique as permissões.
            </p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={videoUrl || undefined}
            autoPlay 
            playsInline 
            loop={!!videoFile}
            muted 
            style={{ transform: videoFile ? "scaleX(1)" : "scaleX(-1)" }}
            className="absolute inset-0 w-full h-full object-contain bg-[rgba(15,23,42,0.8)]" 
          />
        )}
        <HandMetal className="w-48 h-48 text-cyan-400/10 opacity-50 absolute pointer-events-none" />
        
        {isRecording && !videoFile && (
          <div className="absolute top-24 right-6 flex items-center gap-2 glass-panel border-[rgba(220,38,38,0.5)] px-3 py-1.5 rounded-full z-10 shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-red-500/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-300 text-xs font-bold tracking-widest uppercase">REC</span>
          </div>
        )}

        <div className="absolute top-24 left-6 flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full z-10 bg-cyan-500/10 border-cyan-400/30">
          <Camera className="w-4 h-4 text-cyan-300" />
          <span className="text-cyan-300 text-[10px] font-bold tracking-widest uppercase">
            {videoFile ? 'Vídeo Galeria' : 'Frontal Ativa'}
          </span>
        </div>

        {videoFile && (
           <button 
             onClick={clearVideo}
             className="absolute top-24 right-6 p-2 glass-panel rounded-full text-white/70 hover:text-white hover:bg-red-500/20 transition-colors z-10"
           >
             <X className="w-5 h-5" />
           </button>
        )}

        {/* Camera overlay brackets */}
        <div className="absolute w-64 h-80 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl" />
        </div>
      </div>

      <div className="shrink-0 glass-panel rounded-t-3xl border-t border-white/10 border-x-0 border-b-0 -mt-6 z-20 p-6 pb-safe bg-[rgba(15,23,42,0.6)]">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
        
        <div className="min-h-[100px] mb-6 relative">
          <p className={`text-xl text-center leading-relaxed font-bold tracking-wide ${isRecording || isProcessing ? 'text-cyan-200 animate-pulse drop-shadow-md' : 'text-white'}`}>
            {translatedText 
              ? translatedText 
              : ((isRecording || isProcessing) 
                 ? loadingText 
                 : (videoFile ? "Toque no ícone da IA para traduzir o vídeo." : "Posicione a câmera e comece a sinalizar em Libras.")
                )
            }
          </p>
          {!isRecording && translatedText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4">
              <button onClick={copyToClipboard} className="text-white/70 hover:text-white flex items-center gap-1 text-sm glass-panel px-4 py-1.5 rounded-full transition-colors">
                <Copy className="w-4 h-4" /> Copiar
              </button>
              <button className="text-white/70 hover:text-white flex items-center gap-1 text-sm glass-panel px-4 py-1.5 rounded-full transition-colors">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex justify-center items-center gap-6 mt-10">
          {translatedText ? (
            <button
               onClick={() => setTranslatedText("")}
               className="p-4 rounded-full glass-panel text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
          ) : (
            <button
               onClick={() => fileInputRef.current?.click()}
               disabled={isRecording || isProcessing}
               className={`p-4 rounded-full glass-panel transition-colors ${isRecording || isProcessing ? 'opacity-50 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
            >
              <Upload className="w-6 h-6" />
            </button>
          )}

          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />

          <button
            onClick={videoFile ? processVideoTranslation : toggleRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all border ${
              isRecording || isProcessing
                ? 'bg-red-500/80 scale-90 border-red-400/50 shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                : 'bg-cyan-500/80 scale-100 hover:bg-cyan-400 border-cyan-300/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
            }`}
          >
            {isRecording || isProcessing ? <Square className="w-8 h-8 fill-white text-white animate-pulse" /> : <Video className="w-8 h-8 text-white fill-white" />}
          </button>
          
          <div className="w-[56px]" />
        </div>
      </div>
    </div>
  );
}

