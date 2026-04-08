import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const MembershipContext = createContext(null);

export function MembershipProvider({ children }) {
  const { user } = useAuth();
  const [membership, setMembership] = useState({ plan: 'free', status: 'active' });
  const [loading, setLoading] = useState(false);

  const fetchMembership = useCallback(async () => {
    if (!user) { setMembership({ plan: 'free', status: 'active' }); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/membership');
      setMembership(data);
    } catch {
      setMembership({ plan: 'free', status: 'active' });
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
