'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-100 rounded',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem'
      }}
    />
  );
}

// Skeletons específicos para componentes
export function SkeletonCardProduto() {
  return (
    <div className="card-base flex flex-col overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 flex-1 flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListaProdutos() {
  return (
    <div className="card-base">
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-base p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="card-base p-8 space-y-6">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Skeleton className="h-12 w-24" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="card-base p-6 text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="card-base p-6">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
