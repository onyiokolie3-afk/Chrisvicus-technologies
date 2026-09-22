export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyRate {
  base: 'NGN';
  rates: Record<CurrencyCode, number>;
}

export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  NGN: 1,
  USD: 0.000751,
  GBP: 0.000554,
  EUR: 0.000645,
};

export const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
};

export function formatCurrency(amountMinor: number, currency: CurrencyCode): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-NG';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'NGN' ? 2 : 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function convertMinor(amountMinor: number, targetCurrency: CurrencyCode, rates: Record<CurrencyCode, number> = DEFAULT_RATES): number {
  if (targetCurrency === 'NGN') return amountMinor;
  const rate = rates[targetCurrency] || 1;
  return Math.round(amountMinor * rate);
}

export interface ProductAddon {
  id: string;
  name: string;
  basePriceMinor: number;
  durationMinutes: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  unitPriceMinor: number;
  shippingClass: 'standard' | 'bulky';
  stock: number;
  disabled?: boolean;
  brand: 'Hikvision' | 'Dahua' | 'Cisco' | 'MikroTik' | 'Ubiquiti' | 'Dintek' | 'Cambium';
  category: 'accessories' | 'cameras' | 'networking' | 'recorders' | 'wireless';
  usage: Array<'cctv' | 'core' | 'enterprise' | 'isp' | 'outdoor' | 'poe' | 'smb' | 'storage' | 'wifi' | 'wireless-backhaul'>;
  description: string;
  specs?: Record<string, string>;
  addons: ProductAddon[];
}

export const COMMON_ADDONS: ProductAddon[] = [
  {
    id: '2c10b161-37af-4bf2-9fa3-30027c3456d2',
    name: 'CCTV Commissioning & Network Tuning',
    basePriceMinor: 4500000,
    durationMinutes: 120,
  },
  {
    id: 'c771de1a-39c2-4563-8193-a91b0cc5fcae',
    name: 'Firmware & Security Hardening',
    basePriceMinor: 3000000,
    durationMinutes: 60,
  },
  {
    id: 'e8a629fc-8208-4bc1-b278-b0d9a4925e60',
    name: 'Extended Warranty — 24 Months',
    basePriceMinor: 6000000,
    durationMinutes: null,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'b0bc0ec2-10c8-4422-80e8-e4adf4ca4903',
    slug: 'hikvision-acuSense-t124-4mp-dome',
    name: 'Hikvision DS-2CD2143G2-IU AcuSense 4MP Dome',
    sku: 'HK-IPC-T124',
    unitPriceMinor: 18500000, // ₦185,000.00
    shippingClass: 'standard',
    stock: 42,
    brand: 'Hikvision',
    category: 'cameras',
    usage: ['cctv', 'outdoor', 'poe', 'smb'],
    description: 'Vandal-resistant 4MP dome with AcuSense human/vehicle filtering, built-in mic, and IR to 30 m. PoE.',
    specs: {
      'Resolution': '4 Megapixel (2688 × 1520) @ 30fps',
      'Lens Option': '2.8 mm or 4 mm fixed lens',
      'Infrared Range': 'Up to 30 m smart IR illumination',
      'Ingress Protection': 'IP67 weatherproof & IK10 vandal-proof',
      'Audio': 'Built-in microphone for real-time security audio',
      'Analytics': 'Deep learning AcuSense false alarm reduction',
      'Power': 'PoE (802.3af) or 12 VDC',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '39a862ca-cb68-468b-b1c6-aab56d0c9b7d',
    slug: 'hikvision-7632n-i3s8-32ch-nvr',
    name: 'Hikvision DS-7632NI-I3/8S 32-Channel NVR',
    sku: 'HK-NVR-7632',
    unitPriceMinor: 74500000, // ₦745,000.00
    shippingClass: 'bulky',
    stock: 9,
    brand: 'Hikvision',
    category: 'recorders',
    usage: ['cctv', 'enterprise', 'storage'],
    description: '32-channel, 8 SATA bays, 400 Mbps incoming, AcuSense-linked analytics, HDMI+VGA out.',
    specs: {
      'IP Video Input': 'Up to 32 network cameras supported',
      'Incoming Bandwidth': 'Up to 400 Mbps high throughput',
      'Storage Capacity': '8 SATA interfaces (up to 10 TB per HDD)',
      'Video Decoding': 'Up to 32-ch 1080p decoding capability',
      'Display Output': 'Independent HDMI (4K) and VGA output',
      'RAID Support': 'RAID0, RAID1, RAID5, RAID6, RAID10',
      'Chassis': '19-inch 2U rack-mountable chassis',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '4347b24e-0bc0-45f9-ae1c-6cfd8341ceb6',
    slug: 'dahua-wizmind-5mp-bullet',
    name: 'Dahua IPC-HFW3549T1S-AS-PV WizSense 5MP Bullet',
    sku: 'DH-IPC-HFW3549',
    unitPriceMinor: 16200000, // ₦162,000.00
    shippingClass: 'standard',
    stock: 35,
    brand: 'Dahua',
    category: 'cameras',
    usage: ['cctv', 'outdoor', 'poe', 'smb'],
    description: '5MP bullet with audio+light deterrence, starlight sensor, IP67. Ideal for perimeter lines.',
    specs: {
      'Sensor': '1/2.7" 5MP progressive scan CMOS',
      'Deterrence': 'Red & blue flashing lights and siren',
      'Illumination': 'Warm LED & IR dual-smart illuminators (30m)',
      'Night Performance': 'Full-color low-light Starlight technology',
      'Enclosure': 'IP67 robust metal housing',
      'Power': '12V DC / PoE (802.3af)',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '0e8eee27-255a-4d81-93df-ee873e39427b',
    slug: 'cisco-catalyst-9200-48p-4x',
    name: 'Cisco Catalyst C9200-48P-4X 48-Port PoE+ Switch',
    sku: 'CC-C9200-48P',
    unitPriceMinor: 395000000, // ₦3,950,000.00
    shippingClass: 'bulky',
    stock: 4,
    brand: 'Cisco',
    category: 'networking',
    usage: ['core', 'enterprise', 'poe'],
    description: 'Layer 2/3 access switch, 4x10G uplinks, Network Essentials. The backbone for multi-VLAN CCTV fabrics.',
    specs: {
      'Ports': '48 × 10/100/1000 Gigabit Ethernet PoE+ ports',
      'Uplinks': '4 × 10G SFP+ fixed uplinks',
      'PoE Power Budget': 'Up to 740W PoE+ total power',
      'Stacking': 'StackWise-160 with up to 160 Gbps stack bandwidth',
      'Switching Capacity': '176 Gbps / 130.95 Mpps forwarding rate',
      'Software License': 'Cisco IOS XE Network Essentials included',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '97396230-e1dc-424a-bf9b-934203aa647b',
    slug: 'mikrotik-ccr2004g-2s-20t',
    name: 'MikroTik CCR2004-2S-20T Cloud Core Router',
    sku: 'MK-CCR2004',
    unitPriceMinor: 69000000, // ₦690,000.00
    shippingClass: 'standard',
    stock: 12,
    brand: 'MikroTik',
    category: 'networking',
    usage: ['core', 'enterprise', 'isp', 'wireless-backhaul'],
    description: '20-core routing platform with 2x SFP+ and 20x 10G RJ45. Built for ISP and campus edge BGP.',
    specs: {
      'CPU': 'Annapurna Labs Alpine AL32400 Quad-Core 1.7 GHz',
      'RAM': '4 GB DDR4 RAM',
      'SFP+ Ports': '2 × 10G SFP+ cages',
      'Gigabit Ports': '16 × Gigabit Ethernet ports (10/100/1000)',
      'Power Supply': 'Dual redundant hot-swap power supplies',
      'Operating System': 'RouterOS v7 with full BGP, OSPF, WireGuard',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: 'c70f5889-5168-4955-9b41-7062a4784acd',
    slug: 'ubiquiti-u6-long-range-ap',
    name: 'Ubiquiti UniFi U6 Long-Range Access Point',
    sku: 'UB-U6-LR',
    unitPriceMinor: 24500000, // ₦245,000.00
    shippingClass: 'standard',
    stock: 58,
    brand: 'Ubiquiti',
    category: 'wireless',
    usage: ['isp', 'smb', 'wifi'],
    description: 'Wi-Fi 6, 5.1 Gbps aggregate, powered coverage across courtyards and warehouse floors. UniFi managed.',
    specs: {
      'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax)',
      '5 GHz Throughput': 'Up to 2.4 Gbps (4×4 MU-MIMO)',
      '2.4 GHz Throughput': 'Up to 600 Mbps (4×4 MIMO)',
      'Antenna Gain': 'High-gain antenna for extended physical range',
      'Network Interface': '1 × 1 GbE RJ45 Port (PoE+ 802.3at required)',
      'Management': 'UniFi Network Application controller',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '3dcd8cce-b099-4954-b4b8-b6109b789c56',
    slug: 'ubiquiti-dream-machine-roller',
    name: 'Ubiquiti UniFi Dream Machine Pro Max (UDM-Pro-Max)',
    sku: 'UB-ROCK-5X',
    unitPriceMinor: 58500000, // ₦585,000.00
    shippingClass: 'standard',
    stock: 17,
    brand: 'Ubiquiti',
    category: 'networking',
    usage: ['core', 'smb', 'wifi'],
    description: 'Security gateway + controller with 10G SFP+ WAN/LAN, deep packet inspection at multi-gigabit.',
    specs: {
      'Processor': 'Quad-Core ARM Cortex-A57 at 2.0 GHz',
      'System Memory': '8 GB DDR4 with 32 GB eMMC storage',
      'IDS/IPS Throughput': '5 Gbps deep packet inspection & threat detection',
      'Interfaces': '8 × 1 GbE RJ45, 1 × 2.5 GbE RJ45 WAN, 2 × 10G SFP+',
      'Storage Drive': '2 × 3.5" HDD bays for UniFi Protect NVR storage',
      'Display': '1.3" touchscreen for real-time status diagnostics',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '90923819-de27-432d-a230-fede905511db',
    slug: 'dintek-onvif-24p-managed-switch',
    name: 'Dintek 24-Port ONVIF Managed PoE Switch',
    sku: 'DT-ONV-24P',
    unitPriceMinor: 12800000, // ₦128,000.00
    shippingClass: 'standard',
    stock: 26,
    brand: 'Dintek',
    category: 'networking',
    usage: ['cctv', 'poe', 'smb'],
    description: 'Budget CCTV-class managed switch with ONVIF profile support and PoE budgets tuned for NVR uplinks.',
    specs: {
      'Ports': '24 × 10/100/1000M PoE ports + 2 × Gigabit SFP combo',
      'PoE Standards': 'IEEE 802.3af / 802.3at PoE/PoE+',
      'Total PoE Budget': '370W max overall output',
      'Management Features': 'ONVIF device discovery, VLAN, QoS, IGMP snooping',
      'Surge Protection': '6kV port surge protection against lightning strikes',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: '0ce3f119-db47-43d5-9943-581f8a232828',
    slug: 'cambium-cnmae-pmp-600',
    name: 'Cambium Networks PMP 450m 600 Mbps Sector Antenna',
    sku: 'CM-PTMP-600',
    unitPriceMinor: 93000000, // ₦930,000.00
    shippingClass: 'bulky',
    stock: 6,
    brand: 'Cambium',
    category: 'wireless',
    usage: ['isp', 'outdoor', 'wireless-backhaul'],
    description: 'Licensed-band fixed-wireless access sector for last-mile ISP distribution.',
    specs: {
      'Frequency Range': '5 GHz (4900 - 5925 MHz)',
      'Technology': 'Massive Multi-User MIMO (14×14 cnMedusa)',
      'Throughput': 'Up to 1.2 Gbps aggregate capacity per sector',
      'Beamforming': 'Smart adaptive beamforming for high noise rejection',
      'Physical Protection': 'IP67 rated rugged aluminum cast enclosure',
    },
    addons: COMMON_ADDONS,
  },
  {
    id: 'bddd1b88-4ee3-44cb-844e-7dde19ddba7f',
    slug: 'hikvision-wall-mount-bracket',
    name: 'Hikvision DS-1280ZJ-S36 Wall Bracket (Steel)',
    sku: 'HK-DS-1280',
    unitPriceMinor: 950000, // ₦9,500.00
    shippingClass: 'standard',
    stock: 240,
    brand: 'Hikvision',
    category: 'accessories',
    usage: ['cctv', 'smb'],
    description: 'Heavy-duty steel junction bracket for dome installs. Ships flat, cuts install time on ramped jobs.',
    specs: {
      'Material': 'Aluminum alloy & SPCC steel with surface spray',
      'Dimensions': '137 mm × 175 mm × 240 mm',
      'Weight': '820 g',
      'Cable Routing': 'Internal hidden cable canal with waterproof gasket',
      'Compatibility': 'Compatible with Hikvision AcuSense and standard domes',
    },
    addons: COMMON_ADDONS,
  },
];

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind: 'booking';
  basePriceMinor: number;
  durationMinutes: number;
  requiresSchedule: boolean;
  deliverables?: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: '854fe306-cd5f-44e4-a505-4faac067c9ef',
    slug: 'install-full-cctv-site',
    name: 'Full CCTV Site Installation',
    description: 'End-to-end installation for homes and SME sites: cabling, mounting, NVR setup, handover docs.',
    kind: 'booking',
    basePriceMinor: 25000000, // ₦250,000.00
    durationMinutes: 480, // ~8 h
    requiresSchedule: true,
    deliverables: [
      'Site survey and optimal camera angle determination',
      'Cat6 / RG59 conduit and cable laying up to 16 points',
      'Camera mounting, sealing, and weatherproofing',
      'NVR initialization, HDD format, RAID & storage optimization',
      'Mobile remote view app setup (Hik-Connect / DMSS)',
      'System documentation and client orientation session',
    ],
  },
  {
    id: '60999f82-3ef5-4fdf-a843-1afe5e801b23',
    slug: 'isp-link-installation',
    name: 'ISP Link Installation & Alignment',
    description: 'Sector/panel mounting, alignment, PoE injection, and signal benchmarking for WISP links.',
    kind: 'booking',
    basePriceMinor: 21000000, // ₦210,000.00
    durationMinutes: 360, // ~6 h
    requiresSchedule: true,
    deliverables: [
      'Mast/tower physical inspection and mounting bracket installation',
      'Microwave / 5GHz PtP or PtMP radio alignment with spectrum analysis',
      'Grounding, lightning arrestor and surge protection setup',
      'Throughput and latency stress testing across link',
      'MikroTik / Ubiquiti router QoS and VLAN provisioning',
    ],
  },
  {
    id: '7e53c581-9427-4938-bff0-f63f2c69a14a',
    slug: 'support-monthly-maintenance',
    name: 'Monthly Maintenance Retainer',
    description: 'Scheduled preventive maintenance: inspections, firmware windows, cleaning, uptime reporting.',
    kind: 'booking',
    basePriceMinor: 15000000, // ₦150,000.00
    durationMinutes: 180, // ~3 h
    requiresSchedule: true,
    deliverables: [
      'Monthly physical camera lens cleaning and focus adjustment',
      'NVR and switch storage and thermal telemetry checks',
      'RouterOS and UniFi firmware patching during off-peak window',
      'UPS battery runtime benchmarking and power redundancy check',
      'Written monthly uptime and security health summary report',
    ],
  },
  {
    id: '664b954f-622e-4e01-b651-47c5b9c9a7e9',
    slug: 'network-audit-remediation',
    name: 'Network Audit & Remediation',
    description: 'Structured audit of switching, routing, Wi-Fi coverage, and CCTV fabric with a written fix plan.',
    kind: 'booking',
    basePriceMinor: 18000000, // ₦180,000.00
    durationMinutes: 240, // ~4 h
    requiresSchedule: true,
    deliverables: [
      'Comprehensive RF Wi-Fi heat map and coverage inspection',
      'VLAN segmentation and broadcast storm analysis',
      'Switchport bandwidth utilization & PoE budget audit',
      'Firewall rules, port forwards, and NAT table review',
      'Detailed findings report with actionable bill of materials and priority fixes',
    ],
  },
];

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  notes?: string;
}

export interface ShippingCalculation {
  zone: string;
  shippingFeeMinor: number;
  hasBulky: boolean;
}

const ISLAND_AREAS = ['vi', 'v.i', 'victoria island', 'lekki', 'ikoyi', 'ajah', 'ibefun', 'orile', 'onyi', 'marina', 'oniru', 'epe'];
const SOUTH_WEST = ['ogun', 'oyo', 'osun', 'ondo', 'ekiti'];
const SOUTH_EAST_SOUTH_SOUTH = [
  'anambra', 'imo', 'abia', 'enugu', 'ebonyi', 'rivers', 'akwa ibom', 'cross river', 'bayelsa', 'delta', 'edo',
];
const NORTH = [
  'kaduna', 'kano', 'katsina', 'sokoto', 'zamfara', 'kebbi', 'niger', 'bauchi', 'yobe',
  'jigawa', 'borno', 'adamawa', 'gombe', 'taraba', 'nasarawa', 'plateau', 'benue', 'kogi', 'kwara',
];

export function calculateShippingZone(address: Partial<ShippingAddress>): string {
  const country = (address.country || 'NG').trim().toUpperCase();
  if (country !== 'NG') return 'International';

  const state = (address.state || '').trim().toLowerCase().replace(/\s+state$/, '');
  const city = (address.city || '').trim().toLowerCase();

  if (state === 'lagos') {
    if (city === 'vi' || city === 'v.i' || ISLAND_AREAS.some((area) => city.includes(area))) {
      return 'Lagos Island';
    }
    return 'Lagos Mainland';
  }

  if (['abuja', 'fct', 'federal capital territory'].includes(state)) {
    return 'Abuja / FCT';
  }

  if (SOUTH_WEST.includes(state)) {
    return 'South-West';
  }

  if (SOUTH_EAST_SOUTH_SOUTH.includes(state)) {
    return 'South-East / South-South';
  }

  if (NORTH.includes(state)) {
    return 'Northern Nigeria';
  }

  return 'Nigeria (other)';
}

export function calculateShippingQuote(
  address: Partial<ShippingAddress>,
  hasBulkyItem: boolean = false
): ShippingCalculation {
  const zone = calculateShippingZone(address);
  let baseShippingMinor = 350000; // ₦3,500 Lagos Mainland

  switch (zone) {
    case 'Lagos Island':
      baseShippingMinor = 450000; // ₦4,500
      break;
    case 'Lagos Mainland':
      baseShippingMinor = 350000; // ₦3,500
      break;
    case 'Abuja / FCT':
      baseShippingMinor = 750000; // ₦7,500
      break;
    case 'South-West':
      baseShippingMinor = 650000; // ₦6,500
      break;
    case 'South-East / South-South':
      baseShippingMinor = 800000; // ₦8,000
      break;
    case 'Northern Nigeria':
      baseShippingMinor = 950000; // ₦9,500
      break;
    case 'International':
      baseShippingMinor = 4500000; // ₦45,000
      break;
    default:
      baseShippingMinor = 700000; // ₦7,000
      break;
  }

  // Bulky surcharge
  if (hasBulkyItem) {
    baseShippingMinor += 500000; // +₦5,000
  }

  return {
    zone,
    shippingFeeMinor: baseShippingMinor,
    hasBulky: hasBulkyItem,
  };
}
