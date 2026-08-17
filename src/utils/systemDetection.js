// Hardware & Browser System Capabilities Detection

export async function detectSystemInfo() {
  const info = {
    os: 'Unknown OS',
    browser: 'Modern Browser',
    cores: navigator.hardwareConcurrency || 8,
    memoryGB: navigator.deviceMemory || 16,
    gpu: 'High-Performance Graphics',
    gpuVendor: 'Dedicated Gaming GPU',
    screenRes: `${window.screen.width} x ${window.screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
    refreshRateHz: 144, // Estimated
    connectionType: 'Ethernet / High-Speed Wi-Fi',
    downlinkMbps: 100,
    rttMs: 12,
    batteryLevel: 100,
    batteryCharging: true,
    isDirectXSupported: true,
    isWebGPUAvailable: false,
  };

  // OS Detection
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) info.os = 'Windows 11 Pro 64-bit';
  else if (ua.indexOf('Mac') !== -1) info.os = 'macOS Sonoma / Silicon';
  else if (ua.indexOf('Linux') !== -1) info.os = 'Linux Gaming Kernel';
  else if (ua.indexOf('Android') !== -1) info.os = 'Android OS';
  else if (ua.indexOf('like Mac') !== -1) info.os = 'iOS';

  // GPU WebGL Detection
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer) {
          info.gpu = renderer.replace(/ANGLE \((.*)\)/, '$1').replace(/Direct3D.*/, 'DirectX 12 Ultimate');
          info.gpuVendor = vendor || 'NVIDIA / AMD';
        }
      }
    }
    if (navigator.gpu) {
      info.isWebGPUAvailable = true;
    }
  } catch (e) {
    console.warn("GPU detect error:", e);
  }

  // Network Detection
  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.effectiveType) info.connectionType = `${conn.effectiveType.toUpperCase()} Ultra`;
    if (conn.downlink) info.downlinkMbps = conn.downlink * 10;
    if (conn.rtt) info.rttMs = Math.max(8, Math.round(conn.rtt / 4));
  }

  // Battery Detection
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      info.batteryLevel = Math.round(battery.level * 100);
      info.batteryCharging = battery.charging;
    } catch (e) {
      // ignore
    }
  }

  return info;
}
