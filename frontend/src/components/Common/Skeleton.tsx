import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

export const SkeletonBox: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`shimmer-wave ${width} ${height} ${rounded} ${
        darkMode ? 'bg-slate-800/80' : 'bg-slate-200/80'
      } ${className}`}
    />
  );
};

export const StatCardSkeleton: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <SkeletonBox width="w-24" height="h-3" />
        <SkeletonBox width="w-8" height="h-8" rounded="rounded-xl" />
      </div>
      <SkeletonBox width="w-32" height="h-7" />
      <div className="flex items-center gap-2 pt-1">
        <SkeletonBox width="w-12" height="h-3.5" rounded="rounded-full" />
        <SkeletonBox width="w-20" height="h-3" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  const { darkMode } = useTheme();

  return (
    <tr className={darkMode ? 'border-b border-slate-800/60' : 'border-b border-slate-200'}>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="py-4 px-4">
          <SkeletonBox width={idx === 0 ? 'w-24' : idx === 1 ? 'w-36' : 'w-16'} height="h-4" />
        </td>
      ))}
    </tr>
  );
};

export const PlanCardSkeleton: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-6 rounded-2xl border space-y-6 ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBox width="w-20" height="h-3" />
          <SkeletonBox width="w-48" height="h-6" />
        </div>
        <SkeletonBox width="w-32" height="h-6" rounded="rounded-full" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <SkeletonBox width="w-36" height="h-3" />
          <SkeletonBox width="w-24" height="h-3" />
        </div>
        <SkeletonBox width="w-full" height="h-3" rounded="rounded-full" />
        <SkeletonBox width="w-56" height="h-3" />
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <SkeletonBox width="w-24" height="h-4" />
        <div className="flex gap-3">
          <SkeletonBox width="w-28" height="h-8" rounded="rounded-xl" />
          <SkeletonBox width="w-24" height="h-8" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ChatMessageSkeleton: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end">
        <SkeletonBox width="w-64" height="h-10" rounded="rounded-2xl rounded-tr-none" />
      </div>

      <div className="flex items-start gap-2.5">
        <SkeletonBox width="w-7" height="h-7" rounded="rounded-full" />
        <div
          className={`p-4 rounded-2xl rounded-tl-none space-y-2 border w-4/5 ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <SkeletonBox width="w-full" height="h-3" />
          <SkeletonBox width="w-4/5" height="h-3" />
          <SkeletonBox width="w-1/2" height="h-3" />
        </div>
      </div>

      <div className="flex justify-end">
        <SkeletonBox width="w-48" height="h-9" rounded="rounded-2xl rounded-tr-none" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-6 rounded-2xl border space-y-4 shadow-sm ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <SkeletonBox width="w-36" height="h-4" />
        <SkeletonBox width="w-20" height="h-3" />
      </div>
      <div className={`w-full ${height} flex items-end justify-between gap-3 pt-6`}>
        {[40, 65, 30, 80, 50, 90, 45, 70, 60, 85].map((val, i) => (
          <SkeletonBox
            key={i}
            width="w-full"
            height={`h-[${val}%]`}
            rounded="rounded-t-lg"
          />
        ))}
      </div>
    </div>
  );
};

export const CardListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 w-2/3">
            <SkeletonBox width="w-10" height="h-10" rounded="rounded-xl" />
            <div className="space-y-2 w-full">
              <SkeletonBox width="w-48" height="h-4" />
              <SkeletonBox width="w-32" height="h-3" />
            </div>
          </div>
          <SkeletonBox width="w-20" height="h-6" rounded="rounded-full" />
        </div>
      ))}
    </div>
  );
};

export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-xl border flex items-center justify-between ${
            darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="space-y-2 w-3/4">
            <div className="flex items-center gap-2">
              <SkeletonBox width="w-20" height="h-3" />
              <SkeletonBox width="w-12" height="h-3" />
            </div>
            <SkeletonBox width="w-full" height="h-3" />
          </div>
          <SkeletonBox width="w-4" height="h-4" rounded="rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonBox;
