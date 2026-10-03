import axiosClient from './axiosClient';

const MAX_PAGE_SIZE = 200;

export const createCategory = async (payload) => {
  const { data } = await axiosClient.post('/categories', payload);
  return data;
};

// Returns a page: { items, total, limit, offset, hasMore, nextOffset }.
export const listCategories = async (type, { limit, offset, search } = {}) => {
  const params = { type };
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
  if (search?.trim()) params.search = search.trim();
  const { data } = await axiosClient.get('/categories', { params });
  return data;
};

// Category lists are small and feed dropdowns, so fetch every page.
export const listAllCategories = async (type) => {
  const categories = [];
  let offset = 0;
  for (;;) {
    const page = await listCategories(type, { limit: MAX_PAGE_SIZE, offset });
    categories.push(...page.items);
    if (!page.hasMore) return categories;
    offset = page.nextOffset;
  }
};
