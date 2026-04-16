'use client';

import { useRef, useEffect } from 'react';
import L from 'leaflet';

// Fix default icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Project {
  id: number;
  code: string;
  name: string;
  shortName: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  totalBudgetTrillion: number;
  startDate: string;
  endDate: string;
  progressPct: number;
  budgetCommittedPct: number;
  status: string;
  statusLabel: string;
  primaryInvestor: string;
  governmentLead: string;
  localGovt: string;
  riskLevel: string;
  stakeholderTensionIndex: number;
  sourceDocsCount: number;
  featured: boolean;
}

interface ProjectMapProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

function getMarkerColor(project: Project): string {
  if (project.featured || project.riskLevel === 'high') return '#ef4444';
  switch (project.status) {
    case 'construction': return '#3b82f6';
    case 'planning': return '#8b8577';
    case 'design': return '#c8a044';
    case 'land_acquisition': return '#ef4444';
    default: return '#3b82f6';
  }
}

export default function ProjectMap({ projects, onProjectSelect }: ProjectMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [37.25, 127.05],
      zoom: 10,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    projects.forEach((project) => {
      const color = getMarkerColor(project);
      const radius = project.featured ? 12 : 7;

      // Pulsing ring for featured project
      if (project.featured) {
        const pulseMarker = L.circleMarker([project.lat, project.lng], {
          radius: 20,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.15,
          weight: 1,
          className: 'pulse-marker',
        });
        pulseMarker.addTo(map);
      }

      const marker = L.circleMarker([project.lat, project.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2,
      });

      marker.bindPopup(`
        <div style="min-width:220px;font-family:'Noto Sans KR',system-ui,sans-serif;">
          <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:15px;margin-bottom:8px;color:#e8e4dc;">${project.name}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#8b8577;font-size:11px;">사업규모</span>
            <span style="color:#c8a044;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:12px;">${project.totalBudgetTrillion}조원</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#8b8577;font-size:11px;">진행률</span>
            <span style="color:#e8e4dc;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:12px;">${project.progressPct}%</span>
          </div>
          <div style="margin-top:8px;">
            <div style="background:rgba(200,160,68,0.1);border-radius:99px;height:6px;overflow:hidden;">
              <div style="background:${color};height:100%;width:${project.progressPct}%;border-radius:99px;"></div>
            </div>
          </div>
          <div style="margin-top:10px;text-align:center;">
            <span style="display:inline-block;padding:3px 12px;border-radius:99px;font-size:10px;font-weight:600;border:1px solid ${color}60;color:${color};">${project.statusLabel}</span>
          </div>
        </div>
      `);

      marker.on('click', () => onProjectSelect(project));
      marker.addTo(map);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [projects, onProjectSelect]);

  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h2 className="serif-headline text-xl font-bold text-[#e8e4dc]">경기남부 사업 분포도</h2>
      </div>
      <div ref={mapRef} className="w-full h-[500px] dot-grid" />
      <div className="px-6 py-3 flex flex-wrap gap-5 border-t border-[rgba(200,160,68,0.08)]">
        {[
          { color: '#3b82f6', label: '시공중' },
          { color: '#8b8577', label: '계획중' },
          { color: '#c8a044', label: '설계중' },
          { color: '#ef4444', label: '고위험/주요' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-[#8b8577]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
