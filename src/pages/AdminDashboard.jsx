import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Toast from '../components/Toast';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Download,
  LogOut,
  Eye,
  X,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [applicants, setApplicants] = useState([]);

  // Tab State: 'ALL' | 'SECTION1' (YLC Registrations) | 'SECTION2' (MUN Payments)
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest) or 'asc' (oldest)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal & Confirmation State
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusUpdateTarget, setStatusUpdateTarget] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // Get logged in user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }

      // Fetch applicants joined with payment_selections and payment_confirmations
      const { data, error } = await supabase
        .from('applicants')
        .select(`
          *,
          payment_selections (*),
          payment_confirmations (*)
        `)
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (error) {
        // Fallback: try fetching tables individually if nested select fails
        console.warn('Nested query failed, trying manual merge:', error);
        const { data: apps, error: appErr } = await supabase.from('applicants').select('*');
        if (appErr) throw appErr;

        const { data: pSel } = await supabase.from('payment_selections').select('*');
        const { data: pConf } = await supabase.from('payment_confirmations').select('*');

        const merged = (apps || []).map(app => {
          const sel = (pSel || []).filter(s => s.applicant_id === app.id);
          const conf = (pConf || []).filter(c => c.applicant_id === app.id);
          return {
            ...app,
            payment_selections: sel,
            payment_confirmations: conf
          };
        });

        setApplicants(merged);
      } else {
        setApplicants(data || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
      setErrorMsg('Failed to load applicant records. Please check database permissions or try again.');
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  // Helper to extract fields cleanly
  const getApplicantData = (app) => {
    const pSel = Array.isArray(app.payment_selections) ? app.payment_selections[0] : app.payment_selections;
    const pConf = Array.isArray(app.payment_confirmations) ? app.payment_confirmations[0] : app.payment_confirmations;

    return {
      id: app.id,
      ref: app.applicant_reference || `YLC-${app.id?.substring(0, 8)}`,
      name: app.full_name || 'N/A',
      email: app.email || 'N/A',
      phone: app.phone || 'N/A',
      country: app.country || 'N/A',
      admissionAccepted: app.admission_accepted ?? true,
      munAttendanceConfirmed: app.mun_attendance_confirmed ?? true,
      dressCodeAcknowledged: app.dress_code_acknowledged ?? true,
      hasPayment: Boolean(pSel || pConf),
      method: pSel?.payment_method || pConf?.payment_method || 'N/A',
      amount: pSel?.amount ? `GHS ${pSel.amount}` : 'GHS 500',
      txnRef: pConf?.transaction_reference || 'None',
      notes: pConf?.additional_notes || '',
      status: pConf?.payment_status || app.payment_status || 'Pending',
      createdAt: app.created_at || pConf?.created_at || new Date().toISOString(),
      verifiedAt: pConf?.verified_at || null,
      confirmationId: pConf?.id || null
    };
  };

  // Processed Applicants List
  const processedApplicants = useMemo(() => {
    return applicants.map(getApplicantData);
  }, [applicants]);

  // Filtered & Searched Applicants
  const filteredApplicants = useMemo(() => {
    return processedApplicants.filter((app) => {
      // Tab filter
      if (activeTab === 'SECTION1' && (!app.admissionAccepted && !app.munAttendanceConfirmed)) {
        return false;
      }
      if (activeTab === 'SECTION2' && (app.method === 'N/A' && app.status === 'Pending' && !app.hasPayment)) {
        return false;
      }

      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.phone.toLowerCase().includes(query) ||
        app.ref.toLowerCase().includes(query);

      // Method Filter
      const matchesMethod =
        methodFilter === 'ALL' ||
        app.method.toLowerCase().includes(methodFilter.toLowerCase());

      // Status Filter
      const matchesStatus =
        statusFilter === 'ALL' ||
        app.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [processedApplicants, activeTab, searchQuery, methodFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage) || 1;
  const paginatedApplicants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplicants.slice(start, start + itemsPerPage);
  }, [filteredApplicants, currentPage]);

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = processedApplicants.length;
    let pending = 0;
    let awaiting = 0;
    let verified = 0;
    let rejected = 0;

    processedApplicants.forEach((app) => {
      const st = (app.status || '').toLowerCase();
      if (st === 'pending') pending++;
      else if (st === 'awaiting payment') awaiting++;
      else if (st === 'verified') verified++;
      else if (st === 'rejected') rejected++;
    });

    return { total, pending, awaiting, verified, rejected };
  }, [processedApplicants]);

  // Update Payment Status in Supabase
  const executeStatusUpdate = async () => {
    if (!statusUpdateTarget) return;

    const { applicantId, confirmationId, newStatus } = statusUpdateTarget;
    setUpdatingStatus(true);

    try {
      const isVerified = newStatus === 'Verified';
      const verifiedAtValue = isVerified ? new Date().toISOString() : null;

      let updateSuccess = false;

      // 1. Try updating payment_confirmations table if confirmationId exists
      if (confirmationId) {
        const { error: confErr } = await supabase
          .from('payment_confirmations')
          .update({
            payment_status: newStatus,
            verified_at: verifiedAtValue
          })
          .eq('id', confirmationId);

        if (!confErr) updateSuccess = true;
      }

      // 2. Try updating payment_confirmations by applicant_id
      if (!updateSuccess && applicantId) {
        const { error: confAppErr } = await supabase
          .from('payment_confirmations')
          .update({
            payment_status: newStatus,
            verified_at: verifiedAtValue
          })
          .eq('applicant_id', applicantId);

        if (!confAppErr) updateSuccess = true;
      }

      // 3. Fallback: Update applicants table if payment_status column exists there
      if (applicantId) {
        await supabase
          .from('applicants')
          .update({ payment_status: newStatus })
          .eq('id', applicantId);
      }

      showToast(`Payment status updated to "${newStatus}"`, 'success');
      setStatusUpdateTarget(null);
      await fetchDashboardData();
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Failed to update status. Please try again.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (filteredApplicants.length === 0) {
      showToast('No records to export.', 'info');
      return;
    }

    const headers = [
      'Applicant Reference',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Admission Accepted',
      'MUN Confirmed',
      'Dress Code Confirmed',
      'Payment Method',
      'Amount',
      'Transaction Reference',
      'Payment Status',
      'Submission Date',
      'Verified Date'
    ];

    const rows = filteredApplicants.map((app) => [
      `"${app.ref}"`,
      `"${app.name}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.country}"`,
      `"${app.admissionAccepted ? 'Yes' : 'No'}"`,
      `"${app.munAttendanceConfirmed ? 'Yes' : 'No'}"`,
      `"${app.dressCodeAcknowledged ? 'Yes' : 'No'}"`,
      `"${app.method}"`,
      `"${app.amount}"`,
      `"${app.txnRef}"`,
      `"${app.status}"`,
      `"${new Date(app.createdAt).toLocaleString()}"`,
      `"${app.verifiedAt ? new Date(app.verifiedAt).toLocaleString() : 'N/A'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YLC_${activeTab}_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV export downloaded successfully.', 'success');
  };

  const getStatusBadgeStyle = (status) => {
    const st = (status || '').toLowerCase();
    if (st === 'verified') {
      return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: <CheckCircle2 size={13} /> };
    }
    if (st === 'pending') {
      return { bg: '#fefce8', border: '#fef08a', color: '#a16207', icon: <Clock size={13} /> };
    }
    if (st === 'awaiting payment') {
      return { bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1', icon: <AlertCircle size={13} /> };
    }
    if (st === 'rejected') {
      return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: <XCircle size={13} /> };
    }
    return { bg: '#f3f4f6', border: '#e5e7eb', color: '#374151', icon: null };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f9fd',
      color: '#0d1f2d',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header style={{
        background: '#013664',
        borderBottom: '3px solid #009EDB',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 16px rgba(1, 54, 100, 0.12)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#009EDB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: '1.2'
              }}>
                Youth Leadership Cohort
              </h1>
              <p style={{ fontSize: '12px', color: '#c8e9f8', margin: 0 }}>
                Admin Portal & Applicant Management
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <span style={{ fontSize: '13px', color: '#eaf6fc', fontWeight: 500 }}>
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        
        {/* Page Title & Quick Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#013664',
              margin: '0 0 4px 0'
            }}>
              Registrations & Payments Overview
            </h2>
            <p style={{ fontSize: '14px', color: '#4a6f8a', margin: 0 }}>
              Manage delegate admissions, verify transaction reference numbers, and update payment statuses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #d0e6f3',
                color: '#007ab8',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 86, 138, 0.06)'
              }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={exportToCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#009EDB',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 158, 219, 0.2)'
              }}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '24px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              style={{
                background: '#991b1b',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Total */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d0e6f3',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#4a6f8a', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Registrations</span>
              <Users size={18} color="#007ab8" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#013664', fontFamily: "'Playfair Display', serif" }}>
              {metrics.total}
            </div>
          </div>

          {/* Card 2: Pending */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d0e6f3',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#854d0e', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Payments</span>
              <Clock size={18} color="#ca8a04" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#854d0e', fontFamily: "'Playfair Display', serif" }}>
              {metrics.pending}
            </div>
          </div>

          {/* Card 3: Awaiting Payment */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d0e6f3',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0369a1', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Awaiting Payment</span>
              <AlertCircle size={18} color="#0284c7" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0369a1', fontFamily: "'Playfair Display', serif" }}>
              {metrics.awaiting}
            </div>
          </div>

          {/* Card 4: Verified */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d0e6f3',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#047857', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified Payments</span>
              <CheckCircle2 size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#047857', fontFamily: "'Playfair Display', serif" }}>
              {metrics.verified}
            </div>
          </div>

          {/* Card 5: Rejected */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d0e6f3',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b91c1c', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rejected Payments</span>
              <XCircle size={18} color="#dc2626" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#b91c1c', fontFamily: "'Playfair Display', serif" }}>
              {metrics.rejected}
            </div>
          </div>
        </div>

        {/* DISTINCT SECTION TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #d0e6f3',
          paddingBottom: '0'
        }}>
          <button
            onClick={() => { setActiveTab('ALL'); setCurrentPage(1); }}
            style={{
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === 'ALL' ? '3px solid #009EDB' : '3px solid transparent',
              background: activeTab === 'ALL' ? '#ffffff' : 'transparent',
              color: activeTab === 'ALL' ? '#013664' : '#4a6f8a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s'
            }}
          >
            <Users size={16} color={activeTab === 'ALL' ? '#009EDB' : '#4a6f8a'} />
            All Records ({processedApplicants.length})
          </button>

          <button
            onClick={() => { setActiveTab('SECTION1'); setCurrentPage(1); }}
            style={{
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === 'SECTION1' ? '3px solid #009EDB' : '3px solid transparent',
              background: activeTab === 'SECTION1' ? '#ffffff' : 'transparent',
              color: activeTab === 'SECTION1' ? '#013664' : '#4a6f8a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s'
            }}
          >
            <FileCheck size={16} color={activeTab === 'SECTION1' ? '#009EDB' : '#4a6f8a'} />
            Section 1: YLC Cohort Registrations
          </button>

          <button
            onClick={() => { setActiveTab('SECTION2'); setCurrentPage(1); }}
            style={{
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === 'SECTION2' ? '3px solid #009EDB' : '3px solid transparent',
              background: activeTab === 'SECTION2' ? '#ffffff' : 'transparent',
              color: activeTab === 'SECTION2' ? '#013664' : '#4a6f8a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s'
            }}
          >
            <CreditCard size={16} color={activeTab === 'SECTION2' ? '#009EDB' : '#4a6f8a'} />
            Section 2 & 3: MUN GA Delegate Payments
          </button>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #d0e6f3',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4a6f8a' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search name, email, phone, reference..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                fontSize: '13px',
                color: '#0d1f2d',
                background: '#f4f9fd',
                border: '1px solid #d0e6f3',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {/* Payment Method Filter (Visible on ALL and SECTION2) */}
            {activeTab !== 'SECTION1' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#4a6f8a" />
                <select
                  value={methodFilter}
                  onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    padding: '9px 12px',
                    fontSize: '13px',
                    color: '#1c3f5e',
                    background: '#f4f9fd',
                    border: '1px solid #d0e6f3',
                    borderRadius: '8px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Payment Methods</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Book Now, Pay Later">Book Now, Pay Later</option>
                </select>
              </div>
            )}

            {/* Payment Status Filter (Visible on ALL and SECTION2) */}
            {activeTab !== 'SECTION1' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    padding: '9px 12px',
                    fontSize: '13px',
                    color: '#1c3f5e',
                    background: '#f4f9fd',
                    border: '1px solid #d0e6f3',
                    borderRadius: '8px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}

            {/* Sorting */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 12px',
                fontSize: '13px',
                color: '#1c3f5e',
                background: '#f4f9fd',
                border: '1px solid #d0e6f3',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <ArrowUpDown size={14} />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        {/* Applicant Records Table */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #d0e6f3',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 86, 138, 0.05)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#4a6f8a' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid #c8e9f8',
                borderTopColor: '#009EDB',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Loading applicant records…</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#4a6f8a' }}>
              <Users size={36} color="#90cfe8" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#013664', margin: '0 0 6px 0' }}>No records found</h3>
              <p style={{ fontSize: '13px', margin: 0 }}>Try clearing your search terms or switching tabs.</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f4f9fd', borderBottom: '1px solid #d0e6f3', color: '#1c3f5e', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '14px 16px' }}>Reference</th>
                      <th style={{ padding: '14px 16px' }}>Applicant</th>
                      <th style={{ padding: '14px 16px' }}>Contact</th>
                      
                      {/* TAB SPECIFIC HEADERS */}
                      {activeTab === 'SECTION1' ? (
                        <>
                          <th style={{ padding: '14px 16px' }}>Offer Accepted</th>
                          <th style={{ padding: '14px 16px' }}>MUN Attending</th>
                          <th style={{ padding: '14px 16px' }}>Dress Code</th>
                        </>
                      ) : activeTab === 'SECTION2' ? (
                        <>
                          <th style={{ padding: '14px 16px' }}>Payment Method</th>
                          <th style={{ padding: '14px 16px' }}>Txn / Reference</th>
                          <th style={{ padding: '14px 16px' }}>Status</th>
                          <th style={{ padding: '14px 16px' }}>Verified Date</th>
                        </>
                      ) : (
                        <>
                          <th style={{ padding: '14px 16px' }}>Payment Method</th>
                          <th style={{ padding: '14px 16px' }}>Txn / Reference</th>
                          <th style={{ padding: '14px 16px' }}>Status</th>
                        </>
                      )}

                      <th style={{ padding: '14px 16px' }}>Date</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApplicants.map((app) => {
                      const badge = getStatusBadgeStyle(app.status);
                      return (
                        <tr key={app.id} style={{ borderBottom: '1px solid #eaf6fc', transition: 'background 0.15s' }}>
                          <td style={{ padding: '14px 16px', fontFamily: "'Courier New', monospace", fontWeight: 700, color: '#013664' }}>
                            {app.ref}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#0d1f2d' }}>{app.name}</div>
                            <div style={{ fontSize: '12px', color: '#4a6f8a' }}>{app.country}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: '#1c3f5e' }}>{app.email}</div>
                            <div style={{ fontSize: '12px', color: '#4a6f8a' }}>{app.phone}</div>
                          </td>

                          {/* SECTION 1 SPECIFIC COLUMNS */}
                          {activeTab === 'SECTION1' && (
                            <>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ color: app.admissionAccepted ? '#047857' : '#991b1b', fontWeight: 600 }}>
                                  {app.admissionAccepted ? '✓ Yes' : '✕ No'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ color: app.munAttendanceConfirmed ? '#047857' : '#991b1b', fontWeight: 600 }}>
                                  {app.munAttendanceConfirmed ? '✓ Yes' : '✕ No'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ color: app.dressCodeAcknowledged ? '#047857' : '#991b1b', fontWeight: 600 }}>
                                  {app.dressCodeAcknowledged ? '✓ Yes' : '✕ No'}
                                </span>
                              </td>
                            </>
                          )}

                          {/* SECTION 2 SPECIFIC COLUMNS */}
                          {activeTab === 'SECTION2' && (
                            <>
                              <td style={{ padding: '14px 16px', color: '#1c3f5e', fontWeight: 500 }}>
                                {app.method}
                              </td>
                              <td style={{ padding: '14px 16px', fontFamily: "'Courier New', monospace", color: '#007ab8' }}>
                                {app.txnRef}
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  background: badge.bg,
                                  border: `1px solid ${badge.border}`,
                                  color: badge.color
                                }}>
                                  {badge.icon}
                                  {app.status}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', color: '#4a6f8a', fontSize: '12px' }}>
                                {app.verifiedAt ? new Date(app.verifiedAt).toLocaleDateString() : 'N/A'}
                              </td>
                            </>
                          )}

                          {/* ALL RECS COLUMNS */}
                          {activeTab === 'ALL' && (
                            <>
                              <td style={{ padding: '14px 16px', color: '#1c3f5e', fontWeight: 500 }}>
                                {app.method}
                              </td>
                              <td style={{ padding: '14px 16px', fontFamily: "'Courier New', monospace", color: '#007ab8' }}>
                                {app.txnRef}
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  background: badge.bg,
                                  border: `1px solid ${badge.border}`,
                                  color: badge.color
                                }}>
                                  {badge.icon}
                                  {app.status}
                                </span>
                              </td>
                            </>
                          )}

                          <td style={{ padding: '14px 16px', color: '#4a6f8a', fontSize: '12px' }}>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>

                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => setSelectedApplicant(app)}
                                title="View Details"
                                style={{
                                  padding: '6px 10px',
                                  background: '#f4f9fd',
                                  border: '1px solid #d0e6f3',
                                  borderRadius: '6px',
                                  color: '#007ab8',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '12px',
                                  fontWeight: 500
                                }}
                              >
                                <Eye size={14} />
                                View
                              </button>

                              {/* Status Update Quick Selector */}
                              {activeTab !== 'SECTION1' && (
                                <select
                                  value={app.status}
                                  onChange={(e) => {
                                    if (e.target.value !== app.status) {
                                      setStatusUpdateTarget({
                                        applicantId: app.id,
                                        confirmationId: app.confirmationId,
                                        newStatus: e.target.value,
                                        currentStatus: app.status
                                      });
                                    }
                                  }}
                                  style={{
                                    padding: '5px 8px',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d0e6f3',
                                    background: '#ffffff',
                                    color: '#0d1f2d',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Awaiting Payment">Awaiting Payment</option>
                                  <option value="Verified">Verified</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div style={{
                padding: '14px 20px',
                borderTop: '1px solid #d0e6f3',
                background: '#f4f9fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '13px',
                color: '#4a6f8a'
              }}>
                <div>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredApplicants.length)} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredApplicants.length)} of {filteredApplicants.length} records
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d0e6f3',
                      background: currentPage === 1 ? '#f3f4f6' : '#ffffff',
                      color: currentPage === 1 ? '#9ca3af' : '#013664',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <span style={{ fontWeight: 600, color: '#013664' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d0e6f3',
                      background: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
                      color: currentPage === totalPages ? '#9ca3af' : '#013664',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </main>

      {/* APPLICANT DETAILS MODAL */}
      {selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(1, 54, 100, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #d0e6f3'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#013664',
              color: '#ffffff',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #009EDB'
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8e9f8' }}>Applicant Details</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: '2px 0 0 0', color: '#ffffff' }}>
                  {selectedApplicant.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              
              {/* Reference Box */}
              <div style={{
                background: '#f4f9fd',
                border: '1px solid #d0e6f3',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#4a6f8a', fontWeight: 600 }}>Reference Number</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: '18px', fontWeight: 700, color: '#013664' }}>
                    {selectedApplicant.ref}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedApplicant.ref);
                    showToast('Reference copied to clipboard!', 'info');
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #d0e6f3',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: '#007ab8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={13} />
                  Copy
                </button>
              </div>

              {/* Grid 1: Personal & Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Email Address</label>
                  <span style={{ fontSize: '14px', color: '#0d1f2d' }}>{selectedApplicant.email}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Phone Number</label>
                  <span style={{ fontSize: '14px', color: '#0d1f2d' }}>{selectedApplicant.phone}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Country</label>
                  <span style={{ fontSize: '14px', color: '#0d1f2d' }}>{selectedApplicant.country}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Submission Date</label>
                  <span style={{ fontSize: '14px', color: '#0d1f2d' }}>{new Date(selectedApplicant.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Grid 2: Confirmations */}
              <div style={{
                background: '#f4f9fd',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1c3f5e', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Section 1: Confirmed Statements
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color={selectedApplicant.admissionAccepted ? "#059669" : "#dc2626"} />
                    <span>Admission Offer Accepted: <strong>{selectedApplicant.admissionAccepted ? 'Yes' : 'No'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color={selectedApplicant.munAttendanceConfirmed ? "#059669" : "#dc2626"} />
                    <span>Model UN GA Attendance Confirmed: <strong>{selectedApplicant.munAttendanceConfirmed ? 'Yes' : 'No'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color={selectedApplicant.dressCodeAcknowledged ? "#059669" : "#dc2626"} />
                    <span>Official Dress Code Acknowledged: <strong>{selectedApplicant.dressCodeAcknowledged ? 'Yes' : 'No'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Grid 3: Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Payment Method</label>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#013664' }}>{selectedApplicant.method}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Amount</label>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#007ab8' }}>{selectedApplicant.amount}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Transaction Reference</label>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: '14px', fontWeight: 700, color: '#013664' }}>{selectedApplicant.txnRef}</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block' }}>Payment Status</label>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '2px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    ...getStatusBadgeStyle(selectedApplicant.status)
                  }}>
                    {selectedApplicant.status}
                  </span>
                </div>
              </div>

              {selectedApplicant.notes && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#4a6f8a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Additional Notes</label>
                  <div style={{ background: '#f4f9fd', border: '1px solid #d0e6f3', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1c3f5e' }}>
                    {selectedApplicant.notes}
                  </div>
                </div>
              )}

              {selectedApplicant.verifiedAt && (
                <div style={{ fontSize: '12px', color: '#047857', background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  ✓ Verified on {new Date(selectedApplicant.verifiedAt).toLocaleString()}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #d0e6f3',
              background: '#f4f9fd',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setSelectedApplicant(null)}
                style={{
                  padding: '9px 18px',
                  background: '#013664',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STATUS UPDATE CONFIRMATION DIALOG */}
      {statusUpdateTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(1, 54, 100, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1px solid #d0e6f3',
            textAlign: 'center'
          }}>
            <AlertCircle size={36} color="#009EDB" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#013664', margin: '0 0 8px 0' }}>
              Confirm Payment Status Update
            </h3>
            <p style={{ fontSize: '14px', color: '#1c3f5e', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Are you sure you want to change this applicant's payment status to{' '}
              <strong style={{ color: '#013664' }}>"{statusUpdateTarget.newStatus}"</strong>?
              {statusUpdateTarget.newStatus === 'Verified' && (
                <span style={{ display: 'block', marginTop: '6px', fontSize: '12px', color: '#047857' }}>
                  This will set verified_at to the current timestamp.
                </span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setStatusUpdateTarget(null)}
                disabled={updatingStatus}
                style={{
                  padding: '10px 18px',
                  background: '#f4f9fd',
                  border: '1px solid #d0e6f3',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#4a6f8a',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={executeStatusUpdate}
                disabled={updatingStatus}
                style={{
                  padding: '10px 20px',
                  background: '#009EDB',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: updatingStatus ? 'not-allowed' : 'pointer'
                }}
              >
                {updatingStatus ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
