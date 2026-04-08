import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const MembershipContext = createContext(null);

const DEFAULT_MEMBERSHIP = { plan: 'free', status: 'active' };

export function MembershipProvider({ children }) {
  const { user } = useAuth();
  const [membership, setMembership] = useState(DEFAULT_MEMBERSHIP);
  const [loading, setLoading] = useState(false);

  const fetchMembership = useCallback(async () => {
    if (!user) { setMembership(DEFAULT_MEMBERSHIP); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/membership');
      setMembership(data);
    } catch {
      setMembership(DEFAULT_MEMBERSHIP);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchMembership(); }, [fetchMembership]);

  const subscribe = async (plan) => {
    const { data } = await api.post('/membership/subscribe', { plan });
    setMembership(data);
    return data;
  };

  const cancel = async () => {
    const { data } = await api.post('/membership/cancel');
    setMembership(data);
    return data;
  };

  const hasAccess = (minPlan) => {
    const levels = { free: 0, premium: 1, pro: 2 };
    return (levels[membership.plan] ?? 0) >= (levels[minPlan] ?? 0);
  };

  return (
    <MembershipContext.Provider value={{ membership, loading, subscribe, cancel, hasAccess, fetchMembership }}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error('useMembership must be used within MembershipProvider');
  return ctx;
}
