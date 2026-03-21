'use client';

import { MRT_RowData, MaterialReactTable } from 'material-react-table';

import { PaperProps } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function DataTable({
  data,
  columns,
  children: _children,
  ...props
}: PaperProps & {
  data: MRT_RowData[];
  columns: { accessorKey: string; header: string; size: number; grow: boolean }[];
}) {
  const breakpoint = useBreakpoint();
  const router = useRouter();
  const pathName = usePathname();

  const tableProps = {
    layoutMode: 'semantic' as 'semantic',
    muiTablePaperProps: {
      sx: {
        display: 'block',
        minWidth: 0,
        maxWidth:
          breakpoint.isXS ? 'none'
          : breakpoint.isSmall ? '90vw'
          : '60vw',
        width: '100%',
        overflow: 'auto',
      },
      ...props,
    },
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      muiTableBodyCellProps={({ row }) => ({
        onClick: () => {
          router.push(pathName + '/' + row.getValue('id'));
        },
      })}
      {...tableProps}
    />
  );
}
