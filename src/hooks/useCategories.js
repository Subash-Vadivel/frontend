import { useCallback, useEffect, useState } from 'react';
import { createCategory, listCategories } from '../api/categoryApi';

export function useCategories(type) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCategories(await listCategories(type));
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load categories');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCategory = async (name) => {
    const category = await createCategory({ name, type });
    setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
    return category;
  };

  return { categories, loading, error, refresh, addCategory };
}
