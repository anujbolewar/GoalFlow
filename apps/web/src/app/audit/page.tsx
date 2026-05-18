'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Compass,
  ChevronLeft,
  Download,
  ShieldCheck,
  Search,
  Database,
} from 'lucide-react';

export default function AuditTrailPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Realistic mock audit trail database entries
  const [auditEntries] = useState([
    {
      id: 1,
      timestamp: '2026-05-18 16:05:22',
      user: 'Vikram Nair',
      role: 'Manager',
      action: 'APPROVE',
      fieldChanged: 'Status',
      oldValue: 'Draft',
      newValue: 'Locked',
    },
    {
      id: 2,
      timestamp: '2026-05-18 16:03:10',
      user: 'Vikram Nair',
      role: 'Manager',
      action: 'EDIT',
      fieldChanged: 'Target',
      oldValue: '₹45 Lakh',
      newValue: '₹50 Lakh',
    },
    {
      id: 3,
      timestamp: '2026-05-18 15:45:12',
      user: 'Arjun Mehta',
      role: 'Employee',
      action: 'SUBMIT',
      fieldChanged: 'Status',
      oldValue: 'Draft',
      newValue: 'Submitted',
    },
    {
      id: 4,
      timestamp: '2026-05-18 14:20:05',
      user: 'Priya Sharma',
      role: 'Employee',
      action: 'CHECKIN',
      fieldChanged: 'Actuals',
      oldValue: '0%',
      newValue: '15%',
    },
    {
      id: 5,
      timestamp: '2026-05-18 11:10:00',
      user: 'Anita Desai',
      role: 'Admin',
      action: 'CASCADE',
      fieldChanged: 'Shared Goal',
      oldValue: 'None',
      newValue: 'Q3 Quota Target',
    },
  ]);

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesSearch =
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.fieldChanged.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      actionFilter === 'ALL' || entry.action === actionFilter;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Timestamp,User,Action,Field Changed,Old Value,New Value\n' +
      filteredEntries
        .map(
          (e) =>
            `${e.timestamp},${e.user},${e.action},${e.fieldChanged},${e.oldValue},${e.newValue}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'GoalFlow_Immutable_Audit_Log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white p-6 md:p-12">
      {/* Top Navigation Row */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Control Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            GoalFlow
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title Log info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Database className="w-6 h-6 text-[#8B5CF6]" />
              Immutable Audit Ledger
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Secure append-only event sourcing logs for regulatory compliance.
            </p>
          </div>

          <Button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 py-5"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs (CSV)</span>
          </Button>
        </div>

        {/* Filter Desk */}
        <Card className="bg-[#1E293B] border-[#334155] text-white">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#475569]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by User or Field..."
                className="pl-9 bg-[#0F172A] border-[#334155] text-xs h-10 text-white placeholder-slate-600 focus:ring-blue-500 rounded-lg"
              />
            </div>

            {/* Action Segment Filter */}
            <div className="flex bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
              {['ALL', 'EDIT', 'APPROVE', 'SUBMIT'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActionFilter(filter)}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-md uppercase tracking-tight transition-all duration-150 ${
                    actionFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Compliance Badge indicator */}
            <div className="flex items-center justify-end gap-2 text-xs text-green-400 font-semibold px-2">
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>SHA-256 Chain Integrity Verified</span>
            </div>
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card className="bg-[#1E293B] border-[#334155] text-white shadow-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0F172A]/40 border-b border-[#334155]">
                <TableRow className="border-b border-[#334155] hover:bg-transparent">
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    User
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Action
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Field Changed
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Old Value
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4 text-right">
                    New Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((e) => (
                  <TableRow
                    key={e.id}
                    className="border-b border-[#334155]/60 hover:bg-[#334155]/20 transition-all duration-150"
                  >
                    <TableCell className="font-semibold text-xs py-4 text-slate-300">
                      {e.timestamp}
                    </TableCell>
                    <TableCell className="font-bold py-4 text-sm">
                      <div className="flex flex-col">
                        <span>{e.user}</span>
                        <span className="text-[10px] text-[#475569] font-medium">
                          {e.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={`border-none font-bold text-[9px] px-2 py-0.5 ${
                          e.action === 'APPROVE'
                            ? 'bg-green-500/20 text-green-400'
                            : e.action === 'EDIT'
                              ? 'bg-amber-500/20 text-amber-400'
                              : e.action === 'SUBMIT'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {e.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-xs py-4 text-purple-300">
                      {e.fieldChanged}
                    </TableCell>
                    <TableCell className="font-semibold text-xs py-4 text-red-400">
                      {e.oldValue}
                    </TableCell>
                    <TableCell className="font-semibold text-xs py-4 text-right text-green-400">
                      {e.newValue}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-slate-500 text-xs font-bold"
                    >
                      No matching audit records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
