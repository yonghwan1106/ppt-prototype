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
    case 'planning': return '#6b7280';
    case 'design': return '#f59e0b';
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
        <div style="min-width:200px;font-family:system-ui,sans-serif;">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#f9fafb;">${project.name}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="color:#9ca3af;font-size:12px;">사업규모</span>
            <span style="color:#f9fafb;font-weight:600;font-size:12px;">${project.totalBudgetTrillion}조원</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="color:#9ca3af;font-size:12px;">진행률</span>
            <span style="color:#f9fafb;font-weight:600;font-size:12px;">${project.progressPct}%</span>
          </div>
          <div style="margin-top:6px;">
            <div style="background:#374151;border-radius:99px;height:6px;overflow:hidden;">
              <div style="background:${color};height:100%;width:${project.progressPct}%;border-radius:99px;"></div>
            </div>
          </div>
          <div style="margin-top:8px;text-align:center;">
            <span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;background:${color}30;color:${color};">${project.statusLabel}</span>
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
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">지리 정보 시스템</p>
        <h2 className="text-lg font-semibold text-white">경기남부 사업 분포도</h2>
      </div>
      <div ref={mapRef} className="w-full h-[420px]" />
      <div className="px-5 py-3 flex flex-wrap gap-4 border-t border-gray-700/50">
        {[
          { color: '#3b82f6', label: '시공중' },
          { color: '#6b7280', label: '계획중' },
          { color: '#f59e0b', label: '설계중' },
          { color: '#ef4444', label: '고위험/주요' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
