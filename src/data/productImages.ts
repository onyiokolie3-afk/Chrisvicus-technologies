import cctvDome from '../assets/images/cctv_dome_camera_1790105477614.jpg';
import cctvBullet from '../assets/images/cctv_bullet_camera_1790105489876.jpg';
import poeSwitch from '../assets/images/network_poe_switch_1790105500858.jpg';
import coreRouter from '../assets/images/core_router_rack_1790105512576.jpg';
import wifiAp from '../assets/images/wifi_access_point_1790105523659.jpg';
import nvrRecorder from '../assets/images/nvr_video_recorder_1790105534121.jpg';

// Mapping from product slug to high-resolution product photography
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Hikvision Dome Camera
  'hikvision-acuSense-t124-4mp-dome': cctvDome,
  // Hikvision 32-ch NVR
  'hikvision-7632n-i3s8-32ch-nvr': nvrRecorder,
  // Dahua 5MP Bullet Camera
  'dahua-wizmind-5mp-bullet': cctvBullet,
  // Cisco 48-Port PoE+ Catalyst Switch
  'cisco-catalyst-9200-48p-4x': poeSwitch,
  // MikroTik Cloud Core Router
  'mikrotik-ccr2004g-2s-20t': coreRouter,
  // Ubiquiti UniFi U6 Long-Range AP
  'ubiquiti-u6-long-range-ap': wifiAp,
  // Ubiquiti UniFi Dream Machine Pro Max
  'ubiquiti-dream-machine-roller': coreRouter,
  // Dintek 24-Port ONVIF Managed PoE Switch
  'dintek-onvif-24p-managed-switch': poeSwitch,
  // Cambium PMP 450m Sector Antenna
  'cambium-cnmae-pmp-600': wifiAp,
  // Hikvision Wall Mount Bracket
  'hikvision-wall-mount-bracket': cctvDome,
};

// Fallback by product category
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  cameras: cctvDome,
  recorders: nvrRecorder,
  networking: poeSwitch,
  wireless: wifiAp,
  accessories: cctvBullet,
};

export function getProductImage(slug: string, category?: string): string {
  if (PRODUCT_IMAGE_MAP[slug]) {
    return PRODUCT_IMAGE_MAP[slug];
  }
  if (category && CATEGORY_IMAGE_MAP[category]) {
    return CATEGORY_IMAGE_MAP[category];
  }
  return cctvDome;
}

// Service images mapping
export const SERVICE_IMAGE_MAP: Record<string, string> = {
  'install-full-cctv-site': cctvDome,
  'install-isp-link': wifiAp,
  'retainer-monthly-maintenance': coreRouter,
  'audit-remediation-network': poeSwitch,
};
