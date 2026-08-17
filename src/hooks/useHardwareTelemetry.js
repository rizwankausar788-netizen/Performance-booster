import { useState, useEffect, useRef, useCallback } from 'react';
import { detectSystemInfo } from '../utils/systemDetection';
import { sound } from '../utils/audio';

const HISTORY_LENGTH = 60;

export function useHardwareTelemetry() {
  const [sysInfo, setSysInfo] = useState({
    os: 'Windows 11 Pro 64-bit',
    gpu: 'NVIDIA GeForce RTX 4080 Super 16GB GDDR6X',
    cores: 16,
    memoryGB: 32,
    screenRes: '2560 x 1440 @ 165Hz',
    rttMs: 14,
    downlinkMbps: 450,
  });

  // Master Boost State
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [isBoostingSequence, setIsBoostingSequence] = useState(false);
  const [boostStep, setBoostStep] = useState(0);

  // Active Optimizations
  const [optimizations, setOptimizations] = useState({
    ultraLowLatency: true,   // NVIDIA Reflex / Anti-Lag
    ramCleaner: true,         // Standby memory auto purge
    turboCpu: false,          // CPU Core unparking & locked max clock
    gpuBoostLock: true,       // GPU maximum power target
    networkQos: true,         // Bypass Nagle algorithm & QoS gaming
    gameDvrKiller: true,      // Disable background telemetry & recording
    vsync: false,             // V-Sync / FreeSync lock
    fsrSharpening: true,      // Super Resolution & DLSS 3.5 frame gen
  });

  // Overclocking Settings
  const [overclock, setOverclock] = useState({
    coreClockOffset: 120, // +MHz
    memClockOffset: 650,  // +MHz
    powerLimit: 110,      // %
    tempLimit: 85,        // °C
    fanProfile: 'Auto',   // 'Auto' | 'Silent' | 'Turbo' | 'Custom'
    manualFanSpeed: 75,   // %
    voltageOffset: 25,    // +mV
  });

  // Real-time fluctuating hardware stats
  const [stats, setStats] = useState({
    fps: 142,
    fps1PercentLow: 118,
    fps01PercentLow: 96,
    frameTime: 7.04,
    frameVariance: 0.4,
    droppedFrames: 0,
    stabilityScore: 98,

    // CPU Metrics
    cpu: 38,
    cpuTemp: 59,
    cpuClock: 4.85,
    cpuPower: 82,
    cpuFanRpm: 1420,
    cpuVoltage: 1.24,
    cpuCores: [42, 35, 62, 28, 55, 31, 48, 22, 39, 18, 51, 29, 36, 15, 44, 21],

    // GPU Metrics
    gpu: 72,
    gpuTemp: 64,
    gpuHotspotTemp: 73,
    gpuClock: 2580,
    gpuMemClock: 11200,
    gpuVramUsed: 7.8,
    gpuVramTotal: 16.0,
    gpuPower: 265,
    gpuFanRpm: 1750,

    // RAM Metrics
    ramUsed: 11.4,
    ramTotal: 32.0,
    ramStandby: 4.2,
    ramFree: 16.4,
    ramPercent: 48,

    // Disk / Storage
    diskReadSpeed: 184.5,
    diskWriteSpeed: 42.1,
    diskTemp: 44,
    diskActive: 12,

    // Network
    ping: 14,
    jitter: 1.2,
    packetLoss: 0.0,
    downloadMbps: 480.2,
    uploadMbps: 95.6,

    // Diagnostic Scores
    performanceScore: 92,
    gamingRating: 'ELITE S-TIER',
  });

  // History Buffers for Live Multi-Metric Charts
  const [history, setHistory] = useState({
    fps: Array(HISTORY_LENGTH).fill(140),
    frameTime: Array(HISTORY_LENGTH).fill(7.1),
    cpu: Array(HISTORY_LENGTH).fill(38),
    gpu: Array(HISTORY_LENGTH).fill(72),
    ram: Array(HISTORY_LENGTH).fill(48),
    cpuTemp: Array(HISTORY_LENGTH).fill(59),
    gpuTemp: Array(HISTORY_LENGTH).fill(64),
    ping: Array(HISTORY_LENGTH).fill(14),
  });

  // System Events / Optimization Notification Feed
  const [eventLogs, setEventLogs] = useState([
    { id: 1, time: '12:00:04', type: 'info', msg: 'System initialized: DirectX 12 Ultimate & Vulkan drivers loaded.' },
    { id: 2, time: '12:00:05', type: 'success', msg: 'NVIDIA Reflex Low Latency pipeline bound to display engine.' },
    { id: 3, time: '12:00:06', type: 'info', msg: 'Core Affinity Engine assigned high priority to foreground game.' },
  ]);

  // Load real browser capabilities on mount
  useEffect(() => {
    detectSystemInfo().then(info => {
      setSysInfo(prev => ({
        ...prev,
        ...info,
        gpu: info.gpu.length > 5 ? info.gpu : prev.gpu,
      }));
    });
  }, []);

  const addLog = useCallback((type, msg) => {
    const now = new Date().toTimeString().split(' ')[0];
    setEventLogs(prev => [
      { id: Date.now() + Math.random(), time: now, type, msg },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Toggle single optimization
  const toggleOptimization = useCallback((key) => {
    setOptimizations(prev => {
      const nextVal = !prev[key];
      sound.playToggle(nextVal);
      return { ...prev, [key]: nextVal };
    });
  }, []);

  // Update Overclock Settings
  const updateOverclock = useCallback((key, value) => {
    setOverclock(prev => ({ ...prev, [key]: value }));
  }, []);

  // 1-Click Turbo Boost Engine
  const executeSuperBoost = useCallback(() => {
    if (isBoostingSequence) return;
    setIsBoostingSequence(true);
    sound.playBoost();
    setBoostStep(1);

    addLog('warning', 'Initiating APEX TURBO Extreme Optimization Protocol...');

    setTimeout(() => {
      setBoostStep(2);
      addLog('info', 'Terminated 14 background bloatware tasks & suppressed Windows telemetry.');
    }, 450);

    setTimeout(() => {
      setBoostStep(3);
      addLog('info', 'Purged 3.4 GB standby memory cache & flushed DirectX shader cache.');
    }, 900);

    setTimeout(() => {
      setBoostStep(4);
      addLog('info', 'CPU Ultimate Performance Power Plan locked. All cores unparked at 5.1 GHz.');
    }, 1350);

    setTimeout(() => {
      setBoostStep(5);
      addLog('success', 'NVIDIA Reflex 2.0 & Network QoS Gaming packets prioritized.');
      setIsBoostActive(true);
      setIsBoostingSequence(false);
      setBoostStep(0);
      sound.playSuccess();
      addLog('success', '⚡ SUPER BOOST ACTIVE: +32% Framerate stability, -68% Input Latency.');
    }, 1800);
  }, [isBoostingSequence, addLog]);

  // Main Hardware Telemetry Simulator Loop (Runs every 350ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        // Multipliers based on active boosts
        const boostMultiplier = isBoostActive ? 1.28 : 1.0;
        const ocClockBoost = overclock.coreClockOffset * 1.5;
        const vsyncLocked = optimizations.vsync;

        // FPS Calculation
        let baseFps = (120 + (Math.random() - 0.48) * 12) * boostMultiplier;
        if (optimizations.fsrSharpening) baseFps += 18;
        if (vsyncLocked) baseFps = Math.min(144, baseFps);

        const currentFps = Math.max(35, Math.min(280, Math.round(baseFps)));
        const fps1Low = Math.max(25, Math.round(currentFps * (isBoostActive ? 0.88 : 0.76)));
        const fps01Low = Math.max(20, Math.round(currentFps * (isBoostActive ? 0.78 : 0.62)));
        const frameTime = +(1000 / currentFps).toFixed(2);
        const frameVariance = +(isBoostActive ? Math.random() * 0.3 : Math.random() * 1.2 + 0.2).toFixed(2);

        // Dropped frames chance
        const hasDropped = currentFps < 55 ? 1 : 0;

        // CPU & GPU usage
        const baseCpu = isBoostActive ? 32 : 44;
        const cpuVal = Math.max(12, Math.min(98, Math.round(baseCpu + (Math.random() - 0.5) * 8)));
        const gpuVal = Math.max(20, Math.min(100, Math.round(75 + (Math.random() - 0.45) * 10)));

        // Multi-Core loads
        const cores = prev.cpuCores.map((_, i) => {
          const coreBase = i % 2 === 0 ? cpuVal * 1.15 : cpuVal * 0.75;
          return Math.max(5, Math.min(100, Math.round(coreBase + (Math.random() - 0.5) * 12)));
        });

        // Temperatures
        const cpuTemp = Math.round(52 + cpuVal * 0.22 + (optimizations.turboCpu ? 4 : 0));
        const gpuTemp = Math.round(56 + gpuVal * 0.18 + (overclock.coreClockOffset / 40));
        const gpuHotspot = gpuTemp + 9 + Math.round(Math.random() * 2);

        // Clocks
        const cpuClock = +(4.6 + (optimizations.turboCpu ? 0.5 : 0) + cpuVal * 0.005).toFixed(2);
        const gpuClock = Math.round(2450 + ocClockBoost + (gpuVal * 1.5));
        const gpuMemClock = Math.round(10500 + overclock.memClockOffset);

        // RAM
        const ramUsed = +(isBoostActive ? 8.6 + Math.random() * 0.4 : 13.8 + Math.random() * 0.8).toFixed(1);
        const ramStandby = +(isBoostActive ? 1.4 : 5.8).toFixed(1);
        const ramPercent = Math.round((ramUsed / prev.ramTotal) * 100);

        // Network Ping
        const basePing = optimizations.networkQos ? 11 : 28;
        const currentPing = Math.max(8, Math.round(basePing + (Math.random() - 0.4) * 4));

        // Overall Performance Score
        const calculatedScore = Math.min(100, Math.round(
          (currentFps / 144) * 40 +
          (100 - cpuVal) * 0.2 +
          (100 - gpuTemp) * 0.2 +
          (isBoostActive ? 20 : 5)
        ));

        const rating = calculatedScore >= 95 ? 'GODLIKE S+' :
          calculatedScore >= 85 ? 'ELITE S-TIER' :
          calculatedScore >= 70 ? 'PRO A-TIER' : 'MAINSTREAM';

        // Update history buffer
        setHistory(h => ({
          fps: [...h.fps.slice(1), currentFps],
          frameTime: [...h.frameTime.slice(1), frameTime],
          cpu: [...h.cpu.slice(1), cpuVal],
          gpu: [...h.gpu.slice(1), gpuVal],
          ram: [...h.ram.slice(1), ramPercent],
          cpuTemp: [...h.cpuTemp.slice(1), cpuTemp],
          gpuTemp: [...h.gpuTemp.slice(1), gpuTemp],
          ping: [...h.ping.slice(1), currentPing],
        }));

        return {
          ...prev,
          fps: currentFps,
          fps1PercentLow: fps1Low,
          fps01PercentLow: fps01Low,
          frameTime,
          frameVariance,
          droppedFrames: prev.droppedFrames + hasDropped,
          stabilityScore: isBoostActive ? 99 : 92,
          cpu: cpuVal,
          cpuTemp,
          cpuClock,
          cpuPower: Math.round(65 + cpuVal * 0.6),
          cpuFanRpm: Math.round(1100 + cpuTemp * 12),
          cpuVoltage: +(1.22 + cpuVal * 0.001).toFixed(2),
          cpuCores: cores,
          gpu: gpuVal,
          gpuTemp,
          gpuHotspotTemp: gpuHotspot,
          gpuClock,
          gpuMemClock,
          gpuPower: Math.round(210 + gpuVal * 0.9),
          gpuFanRpm: Math.round(1300 + gpuTemp * 14),
          ramUsed,
          ramStandby,
          ramFree: +(prev.ramTotal - ramUsed - ramStandby).toFixed(1),
          ramPercent,
          diskReadSpeed: +(140 + Math.random() * 90).toFixed(1),
          diskWriteSpeed: +(30 + Math.random() * 35).toFixed(1),
          ping: currentPing,
          jitter: +(0.8 + Math.random() * 0.6).toFixed(1),
          performanceScore: calculatedScore,
          gamingRating: rating,
        };
      });
    }, 400);

    return () => clearInterval(timer);
  }, [isBoostActive, optimizations, overclock]);

  return {
    sysInfo,
    stats,
    history,
    eventLogs,
    isBoostActive,
    isBoostingSequence,
    boostStep,
    optimizations,
    overclock,
    toggleOptimization,
    updateOverclock,
    executeSuperBoost,
    addLog,
  };
}
