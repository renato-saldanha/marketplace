'use client';

import ProtecaoRota from '@/components/ProtecaoRota';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  return (
    <ProtecaoRota>
      <DashboardLayout />
    </ProtecaoRota>
  );
}